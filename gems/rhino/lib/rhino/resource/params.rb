# frozen_string_literal: true

module Rhino
  module Resource
    module Params
      extend ActiveSupport::Concern

      included do
        delegate :create_params, :update_params, to: :class
        delegate :transform_params, to: :class
      end

      class_methods do
        def create_params
          raise NotImplementedError, '#create_params is not implemented'
        end

        def update_params
          raise NotImplementedError, '#update_params is not implemented'
        end

        def transform_params(params)
          params
        end
      end
    end
  end
end
