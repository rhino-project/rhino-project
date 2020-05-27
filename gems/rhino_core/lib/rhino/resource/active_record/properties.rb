# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveRecord
      module Properties
        extend ActiveSupport::Concern

        class_methods do # rubocop:disable Metrics/BlockLength
          def identifier_property
            primary_key
          end

          def readable_properties
            props = attribute_names - foreign_key_properties

            props.concat(reference_properties)

            props.map(&:to_s)
          end

          def creatable_properties
            writeable_properties
          end

          def updatable_properties
            writeable_properties
          end

          def describe_property(property)
            name = property_name(property).to_s
            {
              name: name,
              readableName: name.titleize,
              type: property_type(property),
              readable: readable_properties.include?(property),
              creatable: creatable_properties.include?(property),
              updatable: updatable_properties.include?(property),
              nullable: property_nullable?(name)
            }
          end

          private

          # FIXME: Duplicated in params.rb
          def reference_to_sym(reference)
            reference.is_a?(Hash) ? reference.keys.first : reference
          end

          # FIXME: Include counter caches as well
          def automatic_properties
            [identifier_property] + send(:all_timestamp_attributes_in_model)
          end

          def foreign_key_properties
            reflect_on_all_associations(:belongs_to).map(&:foreign_key)
          end

          def reference_properties(read = true)
            references.map do |r|
              sym = reference_to_sym(r)

              # All references are readable
              next sym if read

              # Writeable if a one type or accepting nested
              association = reflect_on_association(sym)
              sym if %i[has_one belongs_to].include?(association.macro) || nested_attributes_options.key?(sym)
            end.compact
          end

          def writeable_properties
            # Direct properties for this model
            props = attribute_names - automatic_properties - foreign_key_properties

            props.concat(reference_properties(false))

            props.map(&:to_s)
          end

          def property_name(property)
            property.is_a?(Hash) ? property.keys.first : property
          end

          def property_type(property) # rubocop:disable Metrics/AbcSize
            name = property_name(property)

            return :identifier if name == identifier_property

            # Use the column type if its an property from the db
            return columns_hash[name.to_s].type if columns_hash.key?(name.to_s)

            if reflections.key?(name)
              return :array if reflections[name].macro == :has_many

              return :reference
            end

            # raise UnknownpropertyType
            'unknown'
          end

          def property_nullable?(name)
            return references[name][:nullable] || false if references.include?(name)

            return columns_hash[name.to_s].null if columns_hash.key?(name.to_s)

            false
          end
        end
      end
    end
  end
end
