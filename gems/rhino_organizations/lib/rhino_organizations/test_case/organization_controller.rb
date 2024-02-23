# frozen_string_literal: true

module Rhino
  module TestCase
    class OrganizationControllerTest < ControllerTest
      protected
        def sign_in_with_organization(role = "admin")
          @current_user = create :user
          @current_organization = create :organization
          @current_role = create :role, name: role
          @current_user_role = create :users_role, role: @current_role, user: @current_user, organization: @current_organization
          sign_in @current_user
        end

        def sign_in_with_organization_and_admin_user
          sign_in_with_organization
        end

        def sign_in_with_organization_and_non_admin_user
          sign_in_with_organization("regular")
        end

        def index(params: {}, headers: {})
          get "/api/organizations", params:, headers:
        end

        def prepare
          sign_in
          index params: @params
        end

        def prepare_with_organization
          sign_in_with_organization_and_admin_user
          index params: @params
        end
    end
  end
end
