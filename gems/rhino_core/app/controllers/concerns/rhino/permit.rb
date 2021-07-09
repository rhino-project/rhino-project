# frozen_string_literal: true

module Rhino
  module Permit
    extend ActiveSupport::Concern

    protected
      # The params are wrapped with 'rest' if the rest_controller is called directly
      # instead of via a customization class
      #
      # Protected to prevent polluting the action method
      #
      # FIXME: Couldn't find a way to call wrap_parameters appropriately
      # FIXME: Will some sort of namespacing break this?
      def pundit_params_for(_record)
        params.require(controller_name)
      end

    private
      def find_resource
        policy_scope(klass).first
      end

      def authorize_resource
        authorize find_resource
      end

      def permit_and_transform(model = @model)
        klass.transform_params(permitted_attributes(model))
      end

      def permit_model(model = @model)
        model_policy = Pundit.policy(current_user, model)

        model_params = ActionController::Parameters.new(model.to_caching_json)
        model_params[:can_current_user_edit] = model_policy.update?
        model_params[:can_current_user_destroy] = model_policy.destroy?
        model_params.permit(model_policy.permitted_attributes_for_show + %i[can_current_user_edit can_current_user_destroy])
      end

      def permit_and_render
        render json: permit_model
      end
  end
end
