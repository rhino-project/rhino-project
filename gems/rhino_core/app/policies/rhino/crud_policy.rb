# frozen_string_literal: true

require_relative 'base_policy'

module Rhino
  # CrudPolicy finds the role for the auth owner and then uses that role
  # to look up a corresponding policy.
  #
  # Authorization for an action, scoping and permitted params are then
  # delegated to that policy
  class CrudPolicy < ::Rhino::BasePolicy
    def check_action(action)
      # We must have a valid user
      # FIXME: Support unauthed user
      return false unless auth_owner

      # If any role allows the action, return true
      # There should only be multiple roles in the case of index because we
      # can't trace to a specific owner for the ActiveRecord class
      # FIXME: Make sure this is ok for create - ie the ownership is enforced/checked
      Rhino.base_owner.roles_for_auth(auth_owner, record).each do |role, _base_owner_array|
        policy_class = Rhino::PolicyHelper.find_policy(role, record)
        next unless policy_class

        return true if policy_class.new(auth_owner, record).send(action)
      end

      false
    end

    def permitted_attributes(action)
      # There should only be one match because record should be a instance not a class
      # for show/create/update
      Rhino.base_owner.roles_for_auth(auth_owner, record).each do |role, _base_owner_array|
        policy_class = Rhino::PolicyHelper.find_policy(role, record)

        return policy_class.new(auth_owner, record).send("permitted_attributes_for_#{action}") if policy_class
      end

      # Return nothing if we didn't find a policy
      []
    end

    def index?
      authorize_action(check_action(:index?))
    end

    def show?
      authorize_action(check_action(:show?))
    end

    def create?
      authorize_action(check_action(:create?))
    end

    def update?
      authorize_action(check_action(:update?))
    end

    def destroy?
      authorize_action(check_action(:destroy?))
    end

    def permitted_attributes_for_create
      permitted_attributes(:create)
    end

    def permitted_attributes_for_show
      permitted_attributes(:show)
    end

    def permitted_attributes_for_update
      permitted_attributes(:update)
    end

    class Scope < ::Rhino::BasePolicy::Scope
      def resolve # rubocop:disable Metrics/AbcSize
        role_scopes = []

        # Get every role for the auth owner
        Rhino.base_owner.roles_for_auth(auth_owner).each do |role, base_owner_array|
          base_owner_array.each do |base_owner|
            scope_class = Rhino::PolicyHelper.find_policy_scope(role, scope)
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
