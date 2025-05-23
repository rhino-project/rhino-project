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
          self._canonical_property ||= find_fallback_property
        end

        def canonical_order
          self._canonical_order ||= canonical_property
        end

        def rhino_property_canonical(property, order: nil)
          self._canonical_property = property.to_s
          self._canonical_order = order&.to_s
        end

        private
          def find_fallback_property
            fallback = Rhino.canonical_fallbacks.find { attribute_names.include?(it) }
            fallback ||= identifier_property
            Rails.logger.info("Using fallback canonical property '#{fallback}' for #{name}")
            fallback
          end
      end
    end
  end
end
