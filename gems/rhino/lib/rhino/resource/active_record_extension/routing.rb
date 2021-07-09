# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveRecordExtension
      module Routing
        extend ActiveSupport::Concern

        class_methods do
          def route_key
            if route_singular?
              model_name.singular_route_key
            else
              model_name.route_key
            end
          end
        end
      end
    end
  end
end
