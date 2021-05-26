# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveRecordExtension
      module Params
        extend ActiveSupport::Concern

        included do
        end

        def create_params
          writeable_params('create')
        end

        def show_params
          readable_params('show')
        end

        def update_params
          writeable_params('update')
        end

        protected
        def reference_to_sym(reference)
          reference.is_a?(Hash) ? reference.keys.first : reference
        end

        def instance_from_sym(sym)
          ref = try(sym)
          return unless ref

          # This is mostly how serializable_hash does it
          # Get the first object
          return ref.first if ref.respond_to?(:to_ary)

          ref
        end

        def assoc_from_sym(sym)
          self.class.reflect_on_association(sym)
        end

        def props_by_type(type)
          # FIXME: Direct attributes for this model we want a copy, not to
          # alter the class_attribute itself
          send("#{type}_properties").dup
        end

        def readable_params(type, refs = references) # rubocop:disable Metrics/AbcSize, Metrics/CyclomaticComplexity, Metrics/MethodLength, Metrics/PerceivedComplexity
          params = []

          refs_index = refs.index_by { |r| reference_to_sym(r) }

          props_by_type('read').each do |prop|
            desc = describe_property(prop)
            prop_sym = prop.to_sym

            # If its a reference or an array of references
            # FIXME: anyOf is a hack for now
            if desc[:type] == :reference || (desc[:type] == :array && (desc[:items].key?(:$ref) || desc[:items].key?(:anyOf)))
              next unless refs_index.key?(prop_sym)

              next_refs = refs_index[prop_sym].is_a?(Hash) ? refs_index[prop_sym][prop_sym] : []
              ref = instance_from_sym(prop_sym)

              # FIXME: This will be blank in the array case; is this ok?
              next unless ref

              next params << { prop.to_s => ref.send('readable_params', type, next_refs) }
            end

            # JSON columns need special handling - allow all the nested params
            next params << { prop => {} } if desc[:type].in?(%i[json jsonb])

            # Generic array of scalars
            next params << { prop => [] } if desc[:type] == :array

            # Otherwise prop and param are equivalent
            params << prop
          end

          # Display name is always allowed
          params << 'display_name'
        end

        def writeable_params(type, _refs = references) # rubocop:disable Metrics/AbcSize, Metrics/CyclomaticComplexity, Metrics/MethodLength, Metrics/PerceivedComplexity
          params = []

          props_by_type(type).each do |prop|
            desc = describe_property(prop)
            prop_sym = prop.to_sym

            # An array of references
            if desc[:type] == :array && (desc[:items].key?(:$ref) || desc[:items].key?(:anyOf))
              # We only accept if the active record accepts it
              next unless nested_attributes_options.key?(prop_sym)

              assoc = assoc_from_sym(prop.to_sym)

              # The identifier_property (primary key) is editable so that updates can occur
              # The nested association editable attributes are editable
              # The nested attributes of the nested association are also editable
              # This does not handle nested for a polymorphic model, but neither does rails
              # FIXME: Do we need to handle :update_only option?
              destroy = [*('_destroy' if nested_attributes_options[prop_sym][:allow_destroy])]
              next params << { prop => [assoc.klass.identifier_property] + assoc.klass.new.send("#{type}_params") + destroy }
            end

            # JSON columns need special handling - allow all the nested params
            next params << { prop => {} } if desc[:type].in?(%i[json jsonb])

            # Generic array of scalars
            next params << { prop => [] } if desc[:type] == :array

            # Accept { blog_post: { :id }} as well as { blog_post: 3 } below
            if desc[:type] == :reference
              assoc = assoc_from_sym(prop.to_sym)

              params << { prop => [assoc.klass.identifier_property] }
            end

            # Otherwise prop and param are equivalent
            # We also accept the ref name as the foreign key if its a singular resource
            params << prop
          end

          params
        end

        class_methods do # rubocop:todo Metrics/BlockLength
          def transform_params(params)
            transform_params_recursive(params)
          end

          # Rebuild the params
          # rubocop:todo Metrics/CyclomaticComplexity
          def transform_params_recursive(params, parent = self) # rubocop:disable Metrics/MethodLength, Metrics/AbcSize, Metrics/PerceivedComplexity
            hash = {}
            params.each do |param_key, param_value|
              association = parent.reflect_on_association(param_key)

              # Its a regular attribute
              next hash[param_key] = param_value unless association

              # FIXME
              # Hack to rewrite for attachment and guard against object resubmission
              if param_key.end_with?('_attachment')
                hash[param_key.remove('_attachment')] = param_value if param_value.is_a? String

                next
              end

              # Transform the nested attributes as well
              # Nested need _attributes - we don't want the client to have to do that
              if parent.nested_attributes_options.key?(param_key.to_sym)
                attr_key = "#{param_key}_attributes"

                # has_many nested should be an array
                if association.macro == :has_many
                  next hash[attr_key] = param_value.map { |pv| parent.transform_params_recursive(pv, association.klass) }
                end

                # has_one/belongs_to is just the values
                # if its a cardinal though, such as blog: 1 instead of blog: {name : 'my blog' }
                # fallback to transforming to the foreign key
                if param_value.is_a?(ActionController::Parameters)
                  next hash[attr_key] = parent.transform_params_recursive(param_value, association.klass)
                end
              end

              # Map association name to foreign key, ie blog => blog_id
              # or blog: { id: } => blog_id
              if param_value.is_a?(ActionController::Parameters)
                next hash[association.foreign_key] = param_value[association.klass.identifier_property]
              end

              hash[association.foreign_key] = param_value
            end

            # Force permit since we should have already been permitted at this point
            ActionController::Parameters.new(hash).permit!
          end
          # rubocop:enable Metrics/CyclomaticComplexity
        end
      end
    end
  end
end
