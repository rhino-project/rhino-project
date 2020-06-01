# frozen_string_literal: true

module Rhino
  class CrudController < BaseController
    # Confirm we are calling authorize and scope correctly
    after_action :verify_authorized
    after_action :verify_policy_scoped, only: %i[index show]

    def create
      @model = authorize klass.new(permit_and_transform(klass.new))
      @model.save!

      permit_and_render
    end

    def index
      authorize klass

      @models = klass.sieves.resolve(policy_scope(klass), params)
      render json: {
        results: @models.eager_load_refs.map { |m| permit_model(m) },
        total: @models.unscope(:limit, :offset).count
      }
    end

    def show
      @model = authorize find_resource(policy_scope(klass).eager_load_refs)

      permit_and_render
    end

    def update
      @model = authorize find_resource
      @model.update!(permit_and_transform)

      permit_and_render
    end

    def destroy
      @model = authorize find_resource
      @model.destroy!

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
      model_params.permit(model_policy.permitted_attributes_for_show + [:can_current_user_edit])
    end

    def permit_and_render
      render json: permit_model
    end
  end
end
