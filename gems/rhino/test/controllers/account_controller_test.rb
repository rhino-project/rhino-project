# frozen_string_literal: true

require "test_helper"

class AccountControllerTest < Rhino::TestCase::ControllerTest
  test "returns current user on get" do
    sign_in
    get account_path, xhr: true

    assert_response_ok
    assert_equal expected_response, parsed_response
  end

  CHANGED_NAME = "Test Name"
  test "returns current user on patch" do
    sign_in
    patch account_path, params: { account: { name: CHANGED_NAME } }, xhr: true

    assert_response_ok
    assert_equal expected_response.merge!("name" => CHANGED_NAME, "display_name" => CHANGED_NAME), parsed_response
  end

  private
    def expected_response(user = @current_user)
      resp = user.to_caching_json.slice("id", "name", "nickname", "email", "image", "display_name")
      resp["can_current_user_edit"] = true
      resp["can_current_user_destroy"] = false

      resp
    end
end
