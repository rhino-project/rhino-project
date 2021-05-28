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

    def action_method?(method)
      method.to_s.ends_with?('?')
    end

    def permitted_method(method)
      method.to_s.match(/^permitted_attributes_for_(.*)/)&.captures&.first
    end

    # Authorize the action with a default permission
    # Ensure the callbacks are run
    def authorize_action(permission)
      run_callbacks :authorize_action do
        permission
      end
    end

    def method_missing(method, *args, &block)
      return authorize_action(false) if action_method?(method)

      # FIXME: Why hard code permitted_attributes_for_create/show/update since
      # this would work?
      # FIXME: If the method does not exist should this crash?
      # a missing action returns false so its inconsistent
      action = permitted_method(method)
      return record.send("#{action}_params") if action

      super
    end

    def respond_to_missing?(method, *)
      method.to_s =~ /\?$/ || permitted_method(method) || super
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
