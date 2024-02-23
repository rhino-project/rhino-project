# frozen_string_literal: true

module Rhino
  class AccountController < BaseController
    include Rhino::Authenticated
    include Rhino::Permit

    # Confirm we are calling authorize and scope correctly
    after_action :verify_authorized
    after_action :verify_policy_scoped

    def show
      @model = authorize_resource

      permit_and_render
    end

    def update
      @model = authorize_resource
      @model.update!(permit_and_transform)

      permit_and_render
    end

    private
      def find_resource
        policy_scope(klass).first
      end

      def authorize_resource
        authorize find_resource
      end
  end
end
