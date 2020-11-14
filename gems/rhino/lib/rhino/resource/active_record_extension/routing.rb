# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveRecordExtension
      module Routing
        extend ActiveSupport::Concern

        class_methods do
          delegate :route_key, to: :model_name
        end
      end
    end
  end
end
