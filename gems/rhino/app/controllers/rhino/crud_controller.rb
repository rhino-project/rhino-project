# frozen_string_literal: true

module Rhino
  class CrudController < BaseController
    include Rhino::Permit

    # Confirm we are calling authorize and scope correctly
    after_action :verify_authorized
    after_action :verify_policy_scoped, only: %i[index show]

    def create
      @model = authorize klass.new(permit_and_transform(klass))
      @model.save!

      permit_and_render
    end

    def index
      authorize klass

      @models = klass.sieves.resolve(policy_scope(klass), params)
      render json: {
        results: @models.eager_load_refs.map { |m| permit_model(m) },
        total: @models.unscope(:limit, :offset).reselect(:id).count
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

    private
      def find_resource(scope = klass.all)
        scope = scope.friendly if scope.respond_to? :friendly
        scope.find(params[:id])
      end
  end
end
