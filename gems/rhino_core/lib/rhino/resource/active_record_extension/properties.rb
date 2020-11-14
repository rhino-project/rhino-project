# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveRecordExtension
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
              readable: read_properties.include?(property),
              creatable: create_properties.include?(property),
              updatable: update_properties.include?(property),
              nullable: property_nullable?(name)
            }.merge(property_validations(property))
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

            return :string if defined_enums.key?(name)

            # Use the column type if its an property from the db
            return attribute_types[name.to_s].type if attribute_types.key?(name.to_s)

            if reflections.key?(name)
              return :array if reflections[name].macro == :has_many

              return :reference
            end

            # raise UnknownpropertyType
            'unknown'
          end

          def property_validations(property) # rubocop:disable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity
            constraint_hash = {}

            # https://swagger.io/specification/

            validators_on(property).each do |v|
              if v.is_a? ActiveModel::Validations::NumericalityValidator
                constraint_hash[:minimum] = v.options[:greater_than] + 1
                constraint_hash[:maximum] = v.options[:less_than] - 1
              end

              if v.is_a? ::ActiveRecord::Validations::LengthValidator
                constraint_hash[:minLength] = v.options[:minimum] || v.options[:is]
                constraint_hash[:maxLength] = v.options[:maximum] || v.options[:is]
              end

              if v.is_a? ActiveModel::Validations::InclusionValidator # rubocop:disable Style/IfUnlessModifier
                constraint_hash[:enum] = v.options[:in]
              end
            end

            constraint_hash[:enum] = defined_enums[property].keys if defined_enums.key?(property)

            constraint_hash.compact
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
