# frozen_string_literal: true

module Rhino
  module Resource
    module Describe
      extend ActiveSupport::Concern

      included do
        delegate :describe, to: :class
      end

      class_methods do
        def describe
          raise NotImplementedError, '#describe is not implemented'
        end
      end
    end
  end
end
