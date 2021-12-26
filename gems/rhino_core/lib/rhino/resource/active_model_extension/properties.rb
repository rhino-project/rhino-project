# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveModelExtension
      module Properties # rubocop:disable Metrics/ModuleLength
        extend ActiveSupport::Concern

        class_methods do # rubocop:disable Metrics/BlockLength
          def identifier_property
            "id"
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

          def describe_property(property) # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
            name = property_name(property).to_s
            {
              "x-rhino-attribute": {
                name: name,
                readableName: name.titleize,
                readable: read_properties.include?(property),
                creatable: create_properties.include?(property),
                updatable: update_properties.include?(property)
              },
              readOnly: property_read_only?(name),
              writeOnly: property_write_only?(name),
              nullable: property_nullable?(name),
              default: property_default(name)
            }
              .merge(property_type(property))
              .merge(property_validations(property))
              .compact
          end

          private
            # FIXME: Duplicated in params.rb
            def reference_to_sym(reference)
              reference.is_a?(Hash) ? reference.keys.first : reference
            end

            def automatic_properties
              [identifier_property]
            end

            def foreign_key_properties
              # reflect_on_all_associations(:belongs_to).map(&:foreign_key).map(&:to_s)
              []
            end

            def reference_properties(read = true) # rubocop:todo Style/OptionalBooleanParameter
              references.filter_map do |r|
                sym = reference_to_sym(r)

                # All references are readable
                next sym if read

                # Writeable if a one type or accepting nested
                association = reflect_on_association(sym)
                # rubocop:todo Performance/CollectionLiteralInLoop
                sym if %i[has_one belongs_to].include?(association.macro) || nested_attributes_options.key?(sym)
                # rubocop:enable Performance/CollectionLiteralInLoop
              end
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

            def ref_descriptor(name)
              {
                type: :reference,
                anyOf: [
                  { :$ref => "#/components/schemas/#{name.singularize}" }
                ]
              }
            end

            def property_type_raw(property)
              name = property_name(property)
              return :identifier if name == identifier_property

              # return :string if defined_enums.key?(name)

              # FIXME: Hack for tags for now
              # if attribute_types.key?(name.to_s) && attribute_types[name.to_s].class.to_s == 'ActsAsTaggableOn::Taggable::TagListType'
              #   return {
              #     type: :array,
              #     items: {
              #       type: 'string'
              #     }
              #   }
              # end

              # Use the attribute type if possible
              return attribute_types[name.to_s].type if attribute_types.key?(name.to_s)

              # if reflections.key?(name)
              #   # FIXME: The tr hack is to match how model_name in rails handles modularized classes
              #   class_name = reflections[name].options[:class_name]&.underscore&.tr('/', '_') || name
              #   return ref_descriptor(class_name) unless reflections[name].macro == :has_many
              #
              #   return {
              #     type: :array,
              #     items: ref_descriptor(class_name)
              #   }
              # end

              # raise UnknownpropertyType
              "unknown"
            end

            def property_type(property)
              pt = property_type_raw(property)

              return pt if pt.is_a? Hash

              { type: property_type_raw(property) }
            end

            # rubocop:todo Metrics/PerceivedComplexity
            def property_validations(property) # rubocop:disable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity
              constraint_hash = {}

              # https://swagger.io/specification/

              validators_on(property).each do |v|
                if v.is_a? ActiveModel::Validations::NumericalityValidator
                  if v.options.key?(:greater_than)
                    constraint_hash[:minimum] = v.options[:greater_than]
                    constraint_hash[:exclusiveMinimum] = true
                  end

                  if v.options.key?(:less_than)
                    constraint_hash[:maximum] = v.options[:less_than]
                    constraint_hash[:exclusiveMaximum] = true
                  end

                  constraint_hash[:minimum] = v.options[:greater_than_or_equal_to] if v.options.key?(:greater_than_or_equal_to)
                  constraint_hash[:maximum] = v.options[:less_than_or_equal_to] if v.options.key?(:less_than_or_equal_to)

                  if v.options.key?(:in)
                    constraint_hash[:minimum] = v.options[:in].min
                    constraint_hash[:maximum] = v.options[:in].max
                  end
                end

                if v.is_a? ::ActiveModel::Validations::LengthValidator
                  constraint_hash[:minLength] = v.options[:minimum] || v.options[:is]
                  constraint_hash[:maxLength] = v.options[:maximum] || v.options[:is]
                end

                constraint_hash[:pattern] = JsRegex.new(v.options[:with]).source if v.is_a? ::ActiveModel::Validations::FormatValidator

                constraint_hash[:enum] = v.options[:in] if v.is_a? ActiveModel::Validations::InclusionValidator
              end

              constraint_hash.compact
            end
            # rubocop:enable Metrics/PerceivedComplexity

            # If there is a presence validator in the model it is not nullable.
            # if there is no optional: true on an association, rails will add a
            # presence validator automatically
            # Otherwise check the db for the actual column or foreign key setting
            # Return nil instead of false for compaction
            def property_nullable?(name)
              # Check for presence validator
              if validators.select { |v| v.is_a? ::ActiveModel::Validations::PresenceValidator }.flat_map(&:attributes).include?(name.to_sym)
                return false
              end

              # By default, numericality doesn't allow nil values. You can use allow_nil: true option to permit it.
              validators_on(name).select { |v| v.is_a? ::ActiveModel::Validations::NumericalityValidator }.each do |v|
                return false unless v.options[:allow_nil]
              end

              true
            end

            # Return nil instead of false for compaction
            def property_read_only?(name)
              return unless read_properties.include?(name) && (create_properties.exclude?(name) && update_properties.exclude?(name))

              true
            end

            # Return nil instead of false for compaction
            def property_write_only?(name)
              return unless (create_properties.include?(name) || update_properties.include?(name)) && read_properties.exclude?(name)

              true
            end

            def property_default(name)
              # FIXME: This will not handle datetime fields
              # https://github.com/rails/rails/issues/27077 sets the default in the db
              # but Blog.new does not set the default value like other attributes
              # https://nubinary.atlassian.net/browse/NUB-298
              _default_attributes[name].type_cast(_default_attributes[name].value_before_type_cast)
            end
        end
      end
    end
  end
end
