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

      # rubocop:disable Style/RedundantSelf
      class_methods do
        def route_key
          self._route_key
        end

        def route_path
          self._route_path ||= route_key
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
      # rubocop:enable Style/RedundantSelf
    end
  end
end
