# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveRecord
      module Attributes
        extend ActiveSupport::Concern

        class_methods do # rubocop:disable Metrics/BlockLength
          def identifier_attribute
            primary_key
          end

          def readable_attributes
            column_names - foreign_key_attributes
          end

          def writeable_attributes # rubocop:disable Metrics/AbcSize
            # Direct attributes for this model
            attrs = column_names - automatic_attributes - foreign_key_attributes

            # Includable attributes
            attrs += included_models.keys

            # Expand included attributes with nested options
            nested_attributes_options.map do |name, options|
              # The nested must be an attribute and includable (not excluded)
              next unless attrs.include?(name.to_s) && included_models.key?(name)

              ref = included_models[name][:klass]
              destroy = [*('_destroy' if options[:allow_destroy])]

              # The identifier_attribute (primary key) is editable so that updates can occur
              # The nested association editable attributes are editable
              # The nested attributes of the nested association are also editable
              # FIXME: Do we need to handle :update_only option?
              attrs[attrs.index(name.to_s)] = { name.to_s => [ref.identifier_attribute] + ref.writeable_attributes + destroy }
            end

            attrs
          end

          def describe_attribute(attribute)
            name = attribute_name(attribute).to_s
            {
              name: name,
              readableName: name.titleize,
              type: attribute_type(attribute),
              creatable: creatable_attributes.include?(attribute),
              updatable: updatable_attributes.include?(attribute),
              nullable: attribute_nullable?(name)
            }
          end

          def transform_creatable_params(params)
            params.transform_keys do |param_key|
              association = reflect_on_association(param_key)

              # Its a regular attribute
              next param_key unless association

              # FIXME
              # Hack to rewrite for attachment
              next param_key.remove('_attachment') if param_key.end_with?('_attachment')

              # Nested need _attributes - we don't want the client to have to do that
              next "#{param_key}_attributes" if association.macro == :has_many

              association.foreign_key
            end
          end

          def transform_updatable_params(params)
            transform_creatable_params(params)
          end

          private

          # FIXME: Include counter caches as well
          def automatic_attributes
            [identifier_attribute] + send(:all_timestamp_attributes_in_model)
          end

          def foreign_key_attributes
            reflect_on_all_associations(:belongs_to).map(&:foreign_key)
          end

          def attribute_name(attribute)
            attribute.is_a?(Hash) ? attribute.keys.first : attribute
          end

          def attribute_type(attribute) # rubocop:disable Metrics/AbcSize
            name = attribute_name(attribute)

            return :identifier if name == identifier_attribute

            # Use the column type if its an attribute from the db
            return columns_hash[name.to_s].type if columns_hash.key?(name.to_s)

            # A one reference or an array of many references
            includable = included_models[name]
            if includable
              return :reference if %i[has_one belongs_to].include?(includable[:macro])
              return :array if includable[:macro] == :has_many
            end

            # raise UnknownAttributeType
            'unknown'
          end

          def attribute_nullable?(name)
            return included_models[name][:nullable] || false if included_models.key?(name)

            return columns_hash[name.to_s].null if columns_hash.key?(name.to_s)

            false
          end
        end
      end
    end
  end
end
