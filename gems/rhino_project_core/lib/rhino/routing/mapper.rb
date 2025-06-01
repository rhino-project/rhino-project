# frozen_string_literal: true

module Rhino
  module Routing
    module Mapper
      def rhino_resources(resource_class, **options)
        defaults = {
          path: resource_class.route_path,
          controller: resource_class.controller_name,
          only: resource_class.routes,
          rhino_resource: resource_class.name,
          format: false
        }

        route_options = defaults.merge(options)

        if resource_class.route_singular?
          resource resource_class.route_key, **route_options
        else
          resources resource_class.route_key, **route_options
        end
      end
    end
  end
end
