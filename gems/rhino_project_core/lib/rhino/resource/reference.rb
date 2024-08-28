# frozen_string_literal: true

module Rhino
  module Resource
    module Reference
      extend ActiveSupport::Concern

      included do
        class_attribute :_references, default: []

        delegate :references, to: :class

        def references_for_serialization
          raise NotImplementedError, '#references_for_serialization is not implemented'
        end
      end

      class_methods do
        def rhino_references(references)
          self._references = references
        end

        def references
          self._references
        end
      end
    end
  end
end
