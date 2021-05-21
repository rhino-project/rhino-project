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

      def get_joins(base, path)
        if path.empty?
          [{}, base]
        else
          key = path.first
          key_is_reflection = base.reflections.key? key
          return nil unless key_is_reflection

          reflection_model = base.reflections[key].klass
          reflection_result, last_base = get_joins(reflection_model, path[1..])
          return nil unless reflection_result

          [{ path.first => reflection_result }, last_base]
        end
      end

      def build_select_clause(model, path, field)
        if path.empty?
          "#{model.to_s.tableize}.*"
        else
          "#{model.to_s.tableize}.#{field}"
        end
      end

      def split_field_path(column_name)
        chunks = column_name.split('.')
        field = chunks.last
        path = chunks.slice(0, chunks.length - 1)
        [path, field]
      end

      def analyze(column_name)
        path, field = split_field_path(column_name)

        join_clauses, last_base = get_joins(@scope.klass, path)
        return nil unless last_base&.attribute_names&.include? field

        select_clause = build_select_clause(last_base, path, field)

        [join_clauses, last_base.arel_table[field], select_clause]
      end

      def order(direction, column_name)
        # nulls_last should generally be the desired user experience
        join_clauses, order_clause, select_clause = analyze(column_name)
        return nil unless join_clauses && order_clause

        [join_clauses, order_clause.send(direction).nulls_last, select_clause]
      end

      def build_clause(param)
        return nil unless string?(param)

        direction, column_name = parse(param)
        order(direction, column_name)
      end

      def group_clauses(clauses)
        join_clauses = clauses.map { |joins, _node, _select| joins }
        order_clauses = clauses.map { |_joins, node, _select| node }
        select_clauses = clauses.map { |_joins, _node, select| select }
        [order_clauses, join_clauses, select_clauses]
      end

      def build_clauses
        clauses = @param.split(',')
                        .map { |el| build_clause(el) }
                        .filter { |joins, node, select| joins && node && select }
        group_clauses(clauses)
      end

      def apply_order
        return @scope unless string?(@param)

        order_clauses, join_clauses, select_clauses = build_clauses
        if order_clauses.empty?
          @scope
        else
          select_clauses << "#{@scope.klass.to_s.tableize}.*"
          @scope = @scope.reorder(nil).select(select_clauses.uniq).joins(join_clauses)
          order_clauses.inject(@scope) { |acc, el| acc.order(el) }
        end
      end
    end
  end
end
