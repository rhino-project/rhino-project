# frozen_string_literal: true

# https://stackoverflow.com/questions/4470108/when-monkey-patching-an-instance-method-can-you-call-the-overridden-method-from/4471202
# Mixin Prepending
module ArelHelpers::JoinAssociation::Extensions
end

module ArelHelpers::JoinAssociation
  def self.join_association(table, association, join_type = Arel::Nodes::InnerJoin, options = {}, &)
    if version >= "7.2.0"
      join_association_7_2_0(table, association, join_type, options, &)
    else
      super
    end
  end

  def self.join_association_7_2_0(table, association, join_type, options = {})
    aliases = options.fetch(:aliases, []).index_by(&:table_name)
    associations = association.is_a?(Array) ? association : [association]

    alias_tracker = ActiveRecord::Associations::AliasTracker.create(
      table.connection_pool, table.name, {}
    )

    join_dependency = ActiveRecord::Associations::JoinDependency.new(
      table, table.arel_table, associations, join_type
    )

    constraints = join_dependency.join_constraints([], alias_tracker, [])

    constraints.map do |join|
      apply_aliases(join, aliases)

      right = if block_given?
        yield join.left.name.to_sym, join.right
      else
        join.right
      end

      join_type.new(join.left, right)
    end
  end
end
