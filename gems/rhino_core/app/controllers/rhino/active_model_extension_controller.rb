# frozen_string_literal: true

module Rhino
  class ActiveModelExtensionController < BaseController
    thread_mattr_accessor :iot_client

    # Confirm we are calling authorize and scope correctly
    # after_action :verify_authorized
    # after_action :verify_policy_scoped, only: %i[index show]

    def create
      @model = authorize klass.new(permit_and_transform(klass.new))
      klass.backing_store_create(@model)

      permit_and_render
    end

    def index
      authorize klass
      @models = klass.backing_store_index

      # FIXME: - policy and sieve scopings
      # @models = klass.sieves.resolve(policy_scope(klass), params)
      render json: {
        results: @models.map { |m| permit_model(m) },
        total: @models.count
      }
    end

    def show
      @model = authorize(klass.backing_store_show(params[:id]))

      permit_and_render
    end

    def update
      @model = klass.new(permit_and_transform(klass.new))
      # FIXME: Return updated model
      @model.backing_store_update

      permit_and_render
    end

    def destroy
      @model = authorize klass.backing_store_show(params[:id])
      @model.backing_store_destroy

      permit_and_render
    end

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
      def client
        return iot_client if iot_client

        Aws::IoT::Client.new
      end

      def find_resource(scope = klass.all)
        scope = scope.friendly if scope.respond_to? :friendly
        scope.find(params[:id])
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
