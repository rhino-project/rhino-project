# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveModelExtension
      module Params
        extend ActiveSupport::Concern

        included do
        end

        def create_params
          writeable_params("create")
        end

        def show_params
          readable_params("show")
        end

        def update_params
          writeable_params("update")
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

            props_by_type("read").each do |prop|
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

                next params << { prop.to_s => ref.send("readable_params", type, next_refs) }
              end

              # JSON columns need special handling - allow all the nested params
              next params << { prop => {} } if desc[:type].in?(%w[json jsonb])

              # Generic array of scalars
              next params << { prop => [] } if desc[:type] == :array

              # Otherwise prop and param are equivalent
              params << prop
            end

            # Display name is always allowed
            params << "display_name"
          end

          # rubocop:todo Metrics/PerceivedComplexity
          def writeable_params(type, _refs = references) # rubocop:disable Metrics/AbcSize,  Metrics/CyclomaticComplexity, Metrics/MethodLength
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
                destroy = [*("_destroy" if nested_attributes_options[prop_sym][:allow_destroy])]
                next params << { prop => [assoc.klass.identifier_property] + assoc.klass.new.send("#{type}_params") + destroy }
              end

              # Generic array of scalars
              next params << { prop => [] } if desc[:type] == :array

              # Otherwise prop and param are equivalent
              # We also accept the ref name as the foreign key if its a singular resource
              params << prop
            end

            # Allow id in if its an update so we can find the original record
            params << identifier_property if type == "update"

            params
          end
          # rubocop:enable Metrics/PerceivedComplexity

          class_methods do
            def transform_params(params)
              transform_params_recursive(params)
            end

            # Rebuild the params
            def transform_params_recursive(params, _parent = self)
              hash = {}
              params.each do |param_key, param_value|
                # Its a regular attribute
                next hash[param_key] = param_value # unless association
              end

              # Force permit since we should have already been permitted at this point
              ActionController::Parameters.new(hash).permit!
            end
          end
      end
    end
  end
end
