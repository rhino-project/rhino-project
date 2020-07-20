# frozen_string_literal: true

module Rhino
  module Sieve
    class Filter
      def initialize(app)
        @app = app
      end

      # filter[blog_id]=1
      def resolve(scope, params)
        return @app.resolve(scope, params) unless params.key?(:filter)

        filter = params[:filter].permit!.to_h
        scope = scope.joins(get_joins(filter))

        @app.resolve(apply_filters(scope, scope.klass, filter).distinct(:id), params)
      end

      private

      def get_joins(filter)
        res = []
        filter.each do |key, val|
          res << { key => get_joins(val) } if val.is_a? Hash
        end
        res
      end

      def apply_filters(objects, base, filter)
        filter.each do |key, val|
          if val.is_a? Hash
            # joined table filter
            bs = base.reflections[key.to_s].klass
            objects = apply_filters(objects, bs, val)
          else
            table = base.to_s.tableize
            objects = objects.where(table => { key => val })
          end
        end
        objects
      end
    end
  end
end
