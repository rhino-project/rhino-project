# frozen_string_literal: true

module Rhino
  module Resource
    module CanonicalProperty
      extend ActiveSupport::Concern

      included do
        class_attribute :_canonical_property, default: nil
        class_attribute :_canonical_order, default: nil
        delegate :canonical_property, :canonical_order, to: :class
      end

      class_methods do
        def canonical_property
          self._canonical_property ||= find_default_property
        end

        def canonical_order
          self._canonical_order ||= canonical_property
        end

        def rhino_property_canonical(property, order: nil)
          self._canonical_property = property.to_s
          self._canonical_order = order&.to_s
        end

        private
          def find_default_property
            default = Rhino.canonical_defaults.find { attribute_names.include?(it) }
            if default
              Rails.logger.info("Using default canonical property '#{default}' for #{name}")
            else
              default = identifier_property
              Rails.logger.warn("No default canonical property found for #{name}, using identifier property '#{default}'")
            end
            default
          end
      end
    end
  end
end
