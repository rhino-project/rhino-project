# frozen_string_literal: true

# Base policy allows no actions by default
# Permitted attributes are the default not empty set though
module Rhino
  class BasePolicy
    include ActiveSupport::Callbacks

    # Do not authorize if any before callbacks return false
    define_callbacks :authorize_action, terminator: ->(_target, result_lambda) { result_lambda.call == false }

    attr_reader :auth_owner, :record

    def initialize(auth_owner, record)
      @auth_owner = auth_owner
      @record = record
    end

    # Authorize the action with a default permission
    # Ensure the callbacks are run
    def authorize_action(permission)
      run_callbacks :authorize_action do
        permission
      end
    end

    def index?
      authorize_action(false)
    end

    def show?
      authorize_action(false)
    end

    def create?
      authorize_action(false)
    end

    def update?
      authorize_action(false)
    end

    def destroy?
      authorize_action(false)
    end

    def permitted_attributes_for_create
      record.create_params
    end

    def permitted_attributes_for_show
      record.show_params
    end

    def permitted_attributes_for_update
      record.update_params
    end

    class Scope
      attr_reader :auth_owner, :scope

      def initialize(auth_owner, scope)
        @auth_owner = auth_owner
        @scope = scope
      end

      def resolve
        scope.none
      end
    end
  end
end
