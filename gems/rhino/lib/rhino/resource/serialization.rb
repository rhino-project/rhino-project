# frozen_string_literal: true

module Rhino
  module Resource
    module Serialization
      extend ActiveSupport::Concern

      included do
      end

      def to_caching_json
        raise NotImplementedError, '#to_caching_json is not implemented'
      end
    end
  end
end
