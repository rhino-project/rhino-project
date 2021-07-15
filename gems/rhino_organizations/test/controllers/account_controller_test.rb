# frozen_string_literal: true

require "test_helper"

class OrganizationAccountControllerTest < Rhino::TestCase::OrganizationControllerTest
  test "returns current user on get" do
    sign_in_with_organization
    get account_path, xhr: true

    assert_response_ok
    assert_equal expected_response, parsed_response
  end

  CHANGED_NAME = "Test Name"
  test "returns current user on patch" do
    sign_in_with_organization
    patch account_path, params: { account: { name: CHANGED_NAME } }, xhr: true

    assert_response_ok
    assert_equal expected_response.merge!("name" => CHANGED_NAME, "display_name" => CHANGED_NAME), parsed_response
  end

  private
    def expected_response(user = @current_user)
      account_user = Account.find(user.id)
      resp = account_user.to_caching_json.slice("id", "name", "nickname", "email", "image", "users_roles", "display_name")
      resp["users_roles"] = resp["users_roles"].map do |ur|
        ur.slice("id", "created_at", "updated_at", "role", "organization", "display_name").deep_transform_values do |rv|
          rv.is_a?(ActiveSupport::TimeWithZone) ? rv.as_json : rv
        end
      end
      resp["can_current_user_edit"] = true
      resp["can_current_user_destroy"] = false

      resp
    end
end
