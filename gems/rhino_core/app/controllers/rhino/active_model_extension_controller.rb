# frozen_string_literal: true

module Rhino
  class ActiveModelExtensionController < BaseController
    include Rhino::Permit

    # Confirm we are calling authorize and scope correctly
    after_action :verify_authorized
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
      @model = authorize klass.new(permit_and_transform(klass.new))
      # FIXME: Return updated model
      @model.backing_store_update

      permit_and_render
    end

    def destroy
      @model = authorize klass.backing_store_show(params[:id])
      @model.backing_store_destroy

      permit_and_render
    end
  end
end
