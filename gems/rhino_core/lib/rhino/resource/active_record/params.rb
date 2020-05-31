# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveRecord
      module Params
        extend ActiveSupport::Concern

        included do # rubocop:disable Metrics/BlockLength
          def create_params
            writeable_params('create')
          end

          def show_params
            readable_params('show')
          end

          def update_params
            writeable_params('update')
          end

          private

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

          def params_by_type(type)
            # FIXME: Direct attributes for this model we want a copy, not to
            # alter the class_attribute itself
            send("#{type}_properties").dup
          end

          def params_without_refs(type)
            params_by_type(type) - references.map { |r| reference_to_sym(r).to_s }
          end

          def readable_params(type, refs = references) # rubocop:disable Metrics/AbcSize
            # FIXME: Use type here
            # Remove all references from the params, they will be re-added
            # in the block below if they are readable
            params = params_without_refs('read')

            # JSON columns need special handling - allow all the nested params
            self.class.columns.select { |col| col.sql_type.in?(%w[json jsonb]) && params.index(col.name) }.each do |col|
              params[params.index(col.name)] = { col.name => {} }
            end

            # Now iterate on the references passed in and expand them
            refs.each do |r|
              sym = reference_to_sym(r)

              ref = instance_from_sym(sym)
              next unless ref

              next_refs = r.is_a?(Hash) ? r[sym] : []
              params << { sym.to_s => ref.send('readable_params', type, next_refs) }
            end

            # Display name is always allowed
            params << 'display_name'
          end

          def writeable_params(type, refs = references) # rubocop:disable Metrics/AbcSize
            # Remove all references from the params, they will be re-added
            # in the block below if they are writeable
            params = params_without_refs(type)

            refs.each do |r|
              sym = reference_to_sym(r)
              assoc = assoc_from_sym(sym)

              # Not nested, but we accept the ref name as the foreign key
              # if its a singular resource
              unless nested_attributes_options.key?(sym)
                params << sym.to_s if assoc.macro.in?(%i[belongs_to has_one])
                next
              end

              # The identifier_property (primary key) is editable so that updates can occur
              # The nested association editable attributes are editable
              # The nested attributes of the nested association are also editable
              # This does not handle nested for a polymorphic model, but neither does rails
              # FIXME: Do we need to handle :update_only option?
              destroy = [*('_destroy' if nested_attributes_options[sym][:allow_destroy])]
              params << { sym.to_s => [assoc.klass.identifier_property] + assoc.klass.new.send("#{type}_params") + destroy }
            end

            params
          end
        end

        class_methods do
          def transform_params(params)
            transform_params_recursive(params)
          end

          protected

          # Rebuild the params
          def transform_params_recursive(params, parent = self) # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
            hash = {}
            params.each do |param_key, param_value|
              association = parent.reflect_on_association(param_key)

              # Its a regular attribute
              next hash[param_key] = param_value unless association

              # FIXME
              # Hack to rewrite for attachment
              next hash[param_key.remove('_attachment')] = param_value if param_key.end_with?('_attachment')

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
              hash[association.foreign_key] = param_value
            end

            # Force permit since we should have already been permitted at this point
            ActionController::Parameters.new(hash).permit!
          end
        end
      end
    end
  end
end
