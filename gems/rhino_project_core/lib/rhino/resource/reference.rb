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
          raise "rhino_references called multiple times for #{model_name}" if self._references.present? # rubocop:disable Style/RedundantSelf

          self._references = references
        end

        def references
          self._references # rubocop:disable Style/RedundantSelf
        end
      end
    end
  end
end
