# frozen_string_literal: true

require "js_regex"

module Rhino
  module Resource
    module ActiveRecordExtension
      module PropertiesDescribe # rubocop:disable Metrics/ModuleLength
        extend ActiveSupport::Concern

        class_methods do # rubocop:disable Metrics/BlockLength
          def describe_property(property) # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
            name = property_name(property).to_s
            raise StandardError, "#{name} is not a valid property" unless property?(name)

            {
              "x-rhino-attribute": {
                name:,
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
              .merge(property_type_and_format(property))
              .merge(property_validations(property))
              .deep_merge(property_overrides(property))
              .compact
          end

          private
            # FIXME: It can be a hash if passed in from a reference which might have something like
            # rhino_references %i[{blog_posts: [:comments]}]
            # but I cannot find current spot where it is used like that currently
            def property_name(property)
              property.is_a?(Hash) ? property.keys.first : property
            end

            def ref_descriptor(names)
              {
                type: :reference,
                anyOf: names.map { |name| { :$ref => "#/components/schemas/#{name.singularize}" } }
              }
            end

            def property_type_and_format_attr(name) # rubocop:todo Metrics/MethodLength
              atype = attribute_types[name.to_s].type

              # The PG array delegates type to "subtype" which is the actual type of the array elements
              if attribute_types[name.to_s].is_a? ActiveRecord::ConnectionAdapters::PostgreSQL::OID::Array
                return {
                  type: :array,
                  items: {
                    type: atype
                  }
                }
              end

              if %i[datetime date time].include?(atype)
                return {
                  type: "string",
                  format: atype
                }
              end

              { type: atype }
            end

            def nested_array_options(name)
              ref_sym = name.to_sym

              array_options = {}

              if nested_attributes_options[ref_sym]
                array_options[:creatable] = true
                array_options[:updatable] = true
                array_options[:destroyable] = nested_attributes_options[ref_sym][:allow_destroy]
              end

              { "x-rhino-attribute-array": array_options.merge(_properties_array[ref_sym] || {}) }
            end

            # rubocop:todo Metrics/PerceivedComplexity
            # rubocop:todo Metrics/AbcSize
            def property_type_and_format_ref(name) # rubocop:todo Metrics/CyclomaticComplexity, Metrics/AbcSize, Metrics/PerceivedComplexity
              assoc = reflections[name]
              klasses = if assoc.options[:polymorphic]
                # If its a delgated type it will have type introspection
                if assoc.active_record.respond_to?("#{assoc.name}_types")
                  assoc.active_record.send("#{assoc.name}_types").map(&:constantize).map { |m| m.model_name.singular }
                else
                  # FIXME: This is wrong, but there is no good way to introspect general polymorphic models
                  [name]
                end
              else
                # FIXME: The tr hack is to match how model_name in rails handles modularized classes
                [assoc.options[:class_name]&.underscore&.tr("/", "_") || name]
              end

              return ref_descriptor(klasses) unless reflections[name].macro == :has_many

              {
                type: :array,
                items: ref_descriptor(klasses).merge(nested_array_options(name))
              }
            end
            # rubocop:enable Metrics/AbcSize
            # rubocop:enable Metrics/PerceivedComplexity

            def property_type_and_format(name) # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
              # Special cases
              return { type: :identifier } if name == identifier_property
              return { type: :string } if defined_enums.key?(name)

              # FIXME: Hack for tags for now
              if attribute_types.key?(name.to_s) && attribute_types[name.to_s].class.to_s == "ActsAsTaggableOn::Taggable::TagListType"
                return {
                  type: :array,
                  items: {
                    type: "string"
                  }
                }
              end

              # Use the attribute type if possible
              return property_type_and_format_attr(name) if attribute_types.key?(name.to_s)

              return property_type_and_format_ref(name) if reflections.key?(name)

              # FIXME: There may be no way to reach this
              # raise UnknownpropertyType
              { type: :unknown }
            end

            def property_overrides(property)
              return {} unless _properties_overrides.key?(property)

              _properties_overrides[property].deep_symbolize_keys
            end

            def property_validations(property) # rubocop:disable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
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

                if v.is_a? ::ActiveRecord::Validations::LengthValidator
                  constraint_hash[:minLength] = v.options[:minimum] || v.options[:is]
                  constraint_hash[:maxLength] = v.options[:maximum] || v.options[:is]
                end

                constraint_hash[:pattern] = JsRegex.new(v.options[:with]).source if v.is_a? ::ActiveModel::Validations::FormatValidator

                constraint_hash[:enum] = v.options[:in] if v.is_a? ActiveModel::Validations::InclusionValidator
              end

              constraint_hash[:enum] = defined_enums[property].keys if defined_enums.key?(property)

              constraint_hash.compact
            end

            # If there is a presence validator in the model it is not nullable.
            # if there is no optional: true on an association, rails will add a
            # presence validator automatically
            # Otherwise check the db for the actual column or foreign key setting
            # Return nil instead of false for compaction
            def property_nullable?(name) # rubocop:todo Metrics/AbcSize
              # Check for any presence validator
              return false if validators_on(name).any?(::ActiveRecord::Validations::PresenceValidator)

              # https://guides.rubyonrails.org/active_record_validations.html#numericality
              # By default, numericality doesn't allow nil values. You can use allow_nil: true option to permit it.
              validators_on(name).select { |v| v.is_a? ::ActiveRecord::Validations::NumericalityValidator }.each do |v|
                return false unless v.options[:allow_nil]
              end

              name = reflections[name].foreign_key if reflections.key?(name)

              # Check the column null setting
              return columns_hash[name].null if columns_hash.key?(name)

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
