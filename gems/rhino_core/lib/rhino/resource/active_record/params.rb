# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveRecord
      module Params
        extend ActiveSupport::Concern

        class_methods do # rubocop:disable Metrics/BlockLength
          def create_params
            writeable_params('create')
          end

          def update_params
            writeable_params('update')
          end

          def transform_params(params)
            transform_params_recursive(params)
          end

          protected

          # FIXME: This should be renamed about params
          def writeable_params(type) # rubocop:disable Metrics/AbcSize
            # Direct attributes for this model
            # We want a copy, not to alter the class_attribute itself
            params = send("#{type}_properties").dup

            references.each do |r|
              name = r.is_a?(Hash) ? r.keys.first : r
              association = reflect_on_association(name)

              params -= [name.to_s] if association.macro == :has_many

              next unless nested_attributes_options.key?(name)

              options = nested_attributes_options[name]
              ref = name.to_s.classify.constantize
              destroy = [*('_destroy' if options[:allow_destroy])]

              # The identifier_property (primary key) is editable so that updates can occur
              # The nested association editable attributes are editable
              # The nested attributes of the nested association are also editable
              # FIXME: Do we need to handle :update_only option?
              next params << { name.to_s => [ref.identifier_property] + ref.send("#{type}_params") + destroy }
            end

            params
          end

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
