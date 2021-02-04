# frozen_string_literal: true

module Rhino
  # FIXME: Same role scoping for permitted params
  class CrudPolicy < ::Rhino::BasePolicy
    def check_action(action)
      # We must have a valid user
      # FIXME: Support unauthed user
      return false unless auth_owner

      # If any role allows the action, return true
      # There should only be multiple roles in the case of index because we
      # can't trace to a specifc owner
      # FIXME: Make sure this is ok for create - ie the ownership is enforced/checked
      Rhino.base_owner.roles_for_auth(auth_owner, record).each do |role, _base_owner_array|
        policy_class = Rhino::PolicyHelper.find_policy(role)
        next unless policy_class

        return true if policy_class.new(auth_owner, record).send(action)
      end

      false
    end

    def method_missing(method, *args, &block)
      return authorize_action(check_action(method)) if action_method?(method)

      super
    end

    def respond_to_missing?(method, *)
      action_method?(method) || super
    end

    class Scope < ::Rhino::BasePolicy::Scope
      def resolve # rubocop:disable Metrics/AbcSize
        role_scopes = []

        # Get every role for the auth owner
        Rhino.base_owner.roles_for_auth(auth_owner).each do |role, base_owner_array|
          base_owner_array.each do |base_owner|
            scope_class = Rhino::PolicyHelper.find_policy_scope(role)
            next unless scope_class

            # Collect all the role based scopes
            # Use the scope for this role and join/select the base owner
            scope_instance = scope_class.new(auth_owner, scope)
            # NUB-367 and NUB-392
            # default scopes with includes and order can cause problems
            scope_instance = scope_instance.resolve.unscope(:includes, :order)
            role_scopes << scope_instance.select(tnpk(scope)).joins(scope.joins_for_base_owner).where(tnpk(Rhino.base_owner) => base_owner.id)
          end
        end

        # Select with present? because scope.none with produce empty sql string
        role_scopes = role_scopes.map(&:to_sql).select(&:present?)

        # UNION all the role based scopes
        # The front end needs to filter per base owner as appropriate
        scope.where("#{tnpk(scope)} in (#{role_scopes.join(' UNION ')})")
      end

      private

      def tnpk(scope)
        "#{scope.table_name}.#{scope.primary_key}"
      end
    end
  end
end
