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
      def parse(param)
        direction = parse_direction(param)
        column_name = parse_column_name(param, direction)
        [direction, column_name]
      end

      def parse_direction(param)
        if param[0] == '-'
          :desc
        else
          :asc
        end
      end

      def parse_column_name(param, direction)
        param = if direction == :asc
                  param
                else
                  param[1..]
                end
        Sieve::Helpers.real_column_name(@scope, param)
      end

      def string?(param)
        param.is_a? String
      end

      def valid?(column_name)
        @scope.attribute_names.include? column_name
      end

      def order(direction, column_name)
        # nulls_last should generally be the desired user experience
        @scope.arel_table[column_name].send(direction).nulls_last
      end

      def build_clause(param)
        return nil unless string?(param)

        direction, column_name = parse(param)
        if valid? column_name
          order(direction, column_name)
        else
          nil
        end
      end

      def apply_order
        return @scope unless string?(@param)

        clauses = @param.split(',')
                        .map { |el| build_clause(el) }
                        .filter { |el| !el.nil? }
        if clauses.empty?
          @scope
        else
          @scope = @scope.reorder(nil)
          clauses.inject(@scope) { |acc, el| acc.order(el) }
        end
      end
    end
  end
end
