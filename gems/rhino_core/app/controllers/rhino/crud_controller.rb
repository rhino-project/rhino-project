# frozen_string_literal: true

module Rhino
  class CrudController < BaseController
    include Api::Filtration

    # Confirm we are calling authorize and scope correctly
    after_action :verify_authorized
    after_action :verify_policy_scoped, only: %i[index show]

    def create
      @model = authorize klass.new(klass.transform_create_params(permitted_attributes(klass.new)))
      unless @model.save
        unprocessable @model.errors
        return
      end
      render json: @model.to_caching_json(current_user)
    end

    def index
      authorize klass
      @models = filter(
        objects: policy_scope(klass),
        filter: (permitted_filter_params[:filter] || {}).to_hash
      )

      render json: { results: @models.eager_load_refs.map { |m| m.to_caching_json(current_user) }, total: @models.count }
    end

    def show
      @model = authorize find_resource(policy_scope(klass).eager_load_refs)

      render json: @model.to_caching_json(current_user)
    end

    def update
      @model = authorize find_resource
      unless @model.update(klass.transform_update_params(permitted_attributes(@model)))
        unprocessable @model.errors
        return
      end
      render json: @model.to_caching_json(current_user)
    end

    def destroy
      @model = authorize find_resource
      unless @model.destroy
        unprocessable @model.errors
        return
      end
      render json: @model.to_caching_json(current_user)
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

    def permitted_filter_params
      params.permit(filter: @klass.permitted_filter_params)
    end
  end
end
