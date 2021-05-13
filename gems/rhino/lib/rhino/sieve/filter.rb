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
        scope = scope.joins(get_joins(scope.klass, filter))
        query = apply_filters(scope, scope.klass, filter).distinct(:id)
        @app.resolve(query, params)
      end

      private
      def get_joins(base, filter)
        res = []
        filter.each do |key, val|
          value_is_hash = val.is_a? Hash
          # only consider a key for the join clause if it is a relationship a.k.a reflection
          key_is_reflection = base.reflections.key? key

          next unless value_is_hash && key_is_reflection

          # in the next recursion, the associations will have to be checked against this current key, not the initial model
          reflection_model = base.reflections[key.to_s].klass
          res << { key => get_joins(reflection_model, val) }
        end
        res
      end

      def apply_filters(scope, base, filter)
        filter.each do |key, val|
          key = Sieve::Helpers.real_column_name(scope, key)
          key_is_reflection = base.reflections.key? key
          key_is_attribute = base.attribute_names.include? key
          next unless key_is_reflection || key_is_attribute

          scope = apply_filter(scope, base, key, val)
        end
        scope
      end

      def apply_filter(scope, base, key, val)
        reflection = base.reflections[key.to_s]
        value_is_hash = val.is_a? Hash
        if value_is_hash && reflection
          # joined table filter, continue recursion, e.g. ?filter[blog][...]
          association_base = reflection.klass
          apply_filters(scope, association_base, val)
        elsif reflection
          # direct association id filter, e.g. ?filter[blog]=1
          apply_association_filter(base, scope, key, val)
        else
          # column filter, e.g. ?filter[name]=...
          apply_column_filter(base, scope, key, val)
        end
      end

      def apply_association_filter(base, scope, key, value)
        table = base.to_s.tableize
        scope.where(table => { key => value })
      end

      def apply_column_filter(base, scope, column_name, column_value)
        parts = column_name.split('::')
        # If there is a specifier like 'category::tree::subtree' we skip it
        return scope unless parts.length == 1

        if column_value.is_a?(Hash)
          # it is a more complex query, possibly using operators like gt, lt, etc.
          # more than one operator per-field is allowed
          column_value.each do |operation, value|
            scope = merge_where_clause(base, scope, column_name, value, operation)
          end
        else
          scope = merge_where_clause(base, scope, column_name, column_value)
        end
        scope
      end

      def merge_where_clause(base, scope, column_name, value, operation = nil)   # rubocop:disable Metrics/CyclomaticComplexity, Metrics/MethodLength
        arel_node = base.arel_table[column_name]
        where_clause = case operation
                       when 'eq' then arel_node.eq(value)
                       when 'gt' then arel_node.gt(value)
                       when 'lt' then arel_node.lt(value)
                       when 'gteq' then arel_node.gteq(value)
                       when 'lteq' then arel_node.lteq(value)
                       when 'diff' then arel_node.not_eq(value)
                       else
                         if value.is_a? Array
                           arel_node.in(value)
                         else
                           arel_node.eq(value)
                         end
                       end
        scope.where(where_clause)
      end
    end
  end
end
