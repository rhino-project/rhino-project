# frozen_string_literal: true

module Rhino
  module Resource
    module Routing
      extend ActiveSupport::Concern

      included do
        class_attribute :_route_key, default: nil
        class_attribute :_route_path, default: nil
        class_attribute :_route_singular, default: false

        class_attribute :_rhino_routes, default: nil
        class_attribute :_rhino_routes_except, default: []

        class_attribute :controller_name, default: 'rhino/crud'

        delegate :routes, to: :class
      end

      class_methods do
        def route_key
          self._route_key ||= if route_singular?
            name.demodulize.underscore
          else
            name.demodulize.underscore.pluralize
          end
        end

        def route_path
          self._route_path ||= route_key
        end

        def route_singular?
          self._route_singular
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
          unless self._rhino_routes
            if global_owner?
              self._rhino_routes = %i[index show]
            else
              self._rhino_routes = %i[index create show update destroy]
            end
          end
          self._rhino_routes - self._rhino_routes_except
        end

        def rhino_routing(**options)
          self._route_key = options.delete(:key) if options.key?(:key)
          self._route_path = options.delete(:path) if options.key?(:path)
          self._route_singular = options.delete(:singular) if options.key?(:singular)

          self._rhino_routes = options.delete(:only) if options.key?(:only)
          self._rhino_routes_except = options.delete(:except) if options.key?(:except)
        end

        def rhino_controller(controller)
          self.controller_name = "rhino/#{controller}"
        end
      end
    end

    def route_frontend
      base_owner_pk = "#{Rhino.base_owner.table_name}.#{Rhino.base_owner.primary_key}"

      joins = joins_for_base_owner
      base_owner_id = if joins.empty?
        # if this is Model is the base owner, we don't to include it in frontend url
        nil
      else
        base_owner_ids = self.class.joins(joins).where(id:).pluck(base_owner_pk)
        if base_owner_ids.length == 1
          base_owner_ids.first
        else
          # if this Model doesn't have a clear single path to the base owner Model,
          # we shouldn't include it in the frontend url
          nil
        end
      end

      if base_owner_id.nil?
        "#{self.class.route_frontend}/#{id}"
      else
        "/#{base_owner_id}#{self.class.route_frontend}/#{id}"
      end
    end

    def route_api
      "#{self.class.route_api}/#{id}"
    end
  end
end
