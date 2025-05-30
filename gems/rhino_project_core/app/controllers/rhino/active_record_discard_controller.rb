# frozen_string_literal: true

module Rhino
  class ActiveRecordDiscardController < CrudController
    def index
      authorize klass

      @models = klass.sieves.resolve(policy_scope(klass), params).kept
      render json: {
        results: @models.eager_load_refs.map { |m| permit_model(m) },
        total: @models.unscope(:limit, :offset).reselect(:id).count
      }
    end

    def show
      @model = authorize find_resource(policy_scope(klass).kept.eager_load_refs)

      permit_and_render
    end

    def destroy
      @model = authorize find_resource
      @model.discard!

      permit_and_render
    end
  end
end
