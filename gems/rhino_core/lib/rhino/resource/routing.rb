# frozen_string_literal: true

module Rhino
  module Resource
    module Routing
      extend ActiveSupport::Concern

      included do
        class_attribute :_route_key, default: name.demodulize.underscore.pluralize
        class_attribute :_route_path, default: nil

        class_attribute :_routes, default: nil
        class_attribute :_routes_except, default: []

        class_attribute :controller_name, default: 'rhino/crud'

        delegate :routes, to: :class
      end

      # rubocop:disable Style/RedundantSelf, Metrics/BlockLength
      class_methods do
        def route_key
          self._route_key
        end

        def route_path
          self._route_path ||= route_key
        end

        def route_path_frontend
          route_path.camelize(:lower)
        end

        def route_frontend
          "/#{route_path_frontend}"
        end

        def route_api
          "/#{Rhino.namespace}/#{route_path}"
        end

        def routes
          unless self._routes
            if global_owner? # rubocop:disable Style/ConditionalAssignment
              self._routes = %i[index show]
            else
              self._routes = %i[index create show update destroy]
            end
          end
          self._routes - self._routes_except
        end

        def rhino_routing(**options)
          self._route_key = options.delete(:key) if options.key?(:key)
          self._route_path = options.delete(:path) if options.key?(:path)

          self._routes = options.delete(:only) if options.key?(:only)
          self._routes_except = options.delete(:except) if options.key?(:except)
        end

        def rhino_controller(controller)
          self.controller_name = "rhino/#{controller}"
        end
      end
      # rubocop:enable Style/RedundantSelf, Metrics/BlockLength
    end

    def route_frontend
      "#{self.class.route_frontend}/#{id}"
    end

    def route_api
      "#{self.class.route_api}/#{id}"
    end
  end
end
