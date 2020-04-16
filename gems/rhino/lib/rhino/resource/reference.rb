# frozen_string_literal: true

module Rhino
  module Resource
    module Reference
      extend ActiveSupport::Concern

      included do
        delegate :describe, to: :class
      end

      class_methods do
        def fetch_reference
          raise NotImplementedError, '#fetch_reference is not implemented'
        end
      end
    end
  end
end
