# frozen_string_literal: true

require_relative 'properties_describe'

module Rhino
  module Resource
    module ActiveRecordExtension
      module Properties
        extend ActiveSupport::Concern

        include Rhino::Resource::ActiveRecordExtension::PropertiesDescribe

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
            reflect_on_all_associations(:belongs_to).map(&:foreign_key).map(&:to_s)
          end

          # rubocop:todo Style/OptionalBooleanParameter
          def reference_properties(read = true)
            references.map do |r|
              sym = reference_to_sym(r)

              # All references are readable
              next sym if read

              # Writeable if a one type or accepting nested
              association = reflect_on_association(sym)
              # rubocop:todo Performance/CollectionLiteralInLoop
              sym if %i[has_one belongs_to].include?(association.macro) || nested_attributes_options.key?(sym)
              # rubocop:enable Performance/CollectionLiteralInLoop
            end.compact
          end
          # rubocop:enable Style/OptionalBooleanParameter

          def writeable_properties
            # Direct properties for this model
            props = attribute_names - automatic_properties - foreign_key_properties

            props.concat(reference_properties(false))

            props.map(&:to_s)
          end
        end
      end
    end
  end
end
