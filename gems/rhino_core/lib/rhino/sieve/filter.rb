# frozen_string_literal: true

module Rhino
  module Sieve
    class Filter # rubocop:disable Metrics/ClassLength
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
      def get_joins_hash(base, filter)
        res = []
        filter.each do |key, val|
          value_is_hash = val.is_a? Hash
          # only consider a key for the join clause if it is a relationship a.k.a reflection
          key_is_reflection = base.reflections.key? key

          next unless value_is_hash && key_is_reflection

          # in the next recursion, the associations will have to be checked against this current key, not the initial model
          reflection_model = base.reflections[key.to_s].klass
          res << { key => get_joins_hash(reflection_model, val) }
        end
        res
      end

      def get_joins(base, filter)
        joins_hash = get_joins_hash(base, filter)
        result = []
        joins_hash.each do |entry|
          entry.each do |key, value|
            inferred_join_type = join_type(filter, key)
            result << ArelHelpers.join_association(base, { key => value }, inferred_join_type, {})
          end
        end
        result
      end

      def apply_filters(scope, base, filter)
        filter.each do |key, val|
          key = Sieve::Helpers.real_column_name(scope, key)
          key_is_reflection = base.reflections.key? key
          key_is_attribute = base.attribute_names.include? key
          key_is_association_operator = ASSOCIATION_OPS.include? key
          if key_is_association_operator
            scope = apply_association_operator(base, scope, key, val)
          elsif key_is_reflection || key_is_attribute
            scope = apply_filter(scope, base, key, val)
          end
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
        scope.where(base.arel_table[base.reflections[key].foreign_key].eq(value))
      end

      ASSOCIATION_OPS = %w[_is_empty].freeze
      def apply_association_operator(base, scope, key, value)
        if key == '_is_empty' && truthy?(value)
          arel_node = base.arel_table['id']

          where_clause = arel_node.eq(nil)
          scope.where(where_clause)
        else
          scope
        end
      end

      def apply_column_filter(base, scope, column_name, column_value)
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

      BASIC_AREL_OPS = %w[eq gt lt gteq lteq].freeze
      def merge_where_clause(base, scope, column_name, value, operation = nil) # rubocop:disable Metrics/MethodLength
        arel_node = base.arel_table[column_name]
        where_clause = case operation
                       when *BASIC_AREL_OPS then arel_node.send(operation, value)
                       when 'diff' then arel_node.not_eq(value)
                       when 'is_null' then apply_is_null(arel_node, value)
                       when /^tree_(.*)/ then apply_tree(Regexp.last_match(1), base, column_name, arel_node, value)
                       else
                         if value.is_a? Array
                           arel_node.in(value)
                         else
                           arel_node.eq(value)
                         end
        end
        scope.where(where_clause)
      end

      def apply_is_null(arel_node, value)
        if ActiveModel::Type::Boolean::FALSE_VALUES.include?(value)
          arel_node.not_eq(nil)
        else
          arel_node.eq(nil)
        end
      end

      def apply_tree(operation, base, column_name, arel_node, value)
        subquery = base.where(column_name => value).map(&operation.to_sym).flatten.map(&column_name.to_sym)

        arel_node.in(subquery)
      end

      def truthy?(value)
        value.present? && ActiveModel::Type::Boolean::FALSE_VALUES.exclude?(value)
      end

      def join_type(filter, key)
        truthy?(filter[key]["_is_empty"]) ? Arel::Nodes::OuterJoin : Arel::Nodes::InnerJoin
      end
    end
  end
end
