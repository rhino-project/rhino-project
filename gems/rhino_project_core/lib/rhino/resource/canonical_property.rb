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
          _canonical_property || begin
            # Try fallbacks in order: name, title
            fallback = %w[name title].find { attribute_names.include?(it) }

            ActiveSupport::Deprecation.new.warn("No canonical property defined for #{name}. Please define a canonical property using rhino_property_canonical. Fallback #{fallback}")
            fallback
          end
        end

        def canonical_order
          _canonical_order || canonical_property
        end

        def rhino_property_canonical(property, order: nil)
          self._canonical_property = property.to_s
          self._canonical_order = order&.to_s
        end
      end
    end
  end
end
