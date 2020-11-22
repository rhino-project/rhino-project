# frozen_string_literal: true

module Rhino
  module Resource
    module Params
      extend ActiveSupport::Concern

      included do
        delegate :transform_params, to: :class
      end

      def create_params
        raise NotImplementedError, '#create_params is not implemented'
      end

      def show_params
        raise NotImplementedError, '#show_params is not implemented'
      end

      def update_params
        raise NotImplementedError, '#update_params is not implemented'
      end

      class_methods do
        def transform_params(params)
          params
        end
      end
    end
  end
end
