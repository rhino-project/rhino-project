# frozen_string_literal: true

module Rhino
  module Sieve
    class Order
      def initialize(app)
        @app = app
      end

      # order=name
      def resolve(scope, params)
        @scope = scope
        @param = params[:order]

        result = apply_order
        @app.resolve(result, params)
      end

      private

      def parse
        @direction = parse_direction
        @column_name = parse_column_name
      end

      def parse_direction
        if @param[0] == '-'
          :desc
        else
          :asc
        end
      end

      def parse_column_name
        param = if @direction == :asc
                  @param
                else
                  @param[1..]
                end
        Sieve::Helpers.real_column_name(@scope, param)
      end

      def string?
        @param.is_a? String
      end

      def valid?
        @scope.attribute_names.include? @column_name
      end

      def order
        @scope.arel_table[@column_name].send @direction
      end

      def apply_order
        return @scope unless string?

        parse
        if valid?
          @scope.reorder(order)
        else
          @scope
        end
      end
    end
  end
end
