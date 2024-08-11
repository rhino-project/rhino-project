# frozen_string_literal: true

require "test_helper"

class InvitationsControllerTest < Rhino::TestCase::ControllerTest
  test "update should return status 200 and set cookie when valid token and password" do
    token = "qimARyZ2Yu2pDVgZzsJL"
    create(:user, invitation_token: Devise.token_generator.digest(self, :invitation_token, token))
    password = "password"

    put user_invitation_path, params: {
      invitation_token: token,
      password:,
      password_confirmation: password
    }

    assert_response_ok
    assert_not_empty response.cookies[DeviseTokenAuth.cookie_name]
  end

  test "update should return status 422 and errors when valid token but invalid password" do
    token = "qimARyZ2Yu2pDVgZzsJL"
    create(:user, invitation_token: Devise.token_generator.digest(self, :invitation_token, token))
    password = "pass"

    put user_invitation_path, params: {
      invitation_token: token,
      password:,
      password_confirmation: password
    }

    assert_response :unprocessable_entity
    assert_equal(
      { "status" => "error",
        "errors" => { "password" => ["is too short (minimum is 6 characters)"] } },
      JSON.parse(response.body)
    )
  end

  test "update should return status 422 and errors when valid token but passwords do not match" do
    token = "qimARyZ2Yu2pDVgZzsJL"
    create(:user, invitation_token: Devise.token_generator.digest(self, :invitation_token, token))
    password = "password"

    put user_invitation_path, params: {
      invitation_token: token,
      password:,
      password_confirmation: "pass"
    }

    assert_response :unprocessable_entity
    assert_equal(
      { "status" => "error",
        "errors" => { "password_confirmation" => ["doesn't match Password"] } },
      JSON.parse(response.body)
    )
  end

  test "update should return status 422 and errors when invalid token" do
    token = "qimARyZ2Yu2pDVgZzsJL"
    create(:user, invitation_token: Devise.token_generator.digest(self, :invitation_token, token))
    password = "password"

    put user_invitation_path, params: {
      invitation_token: "invalid",
      password:,
      password_confirmation: password
    }

    assert_response :unprocessable_entity
    assert_equal(
      { "status" => "error",
        "errors" => { "invitation_token" => ["is invalid"] } },
      JSON.parse(response.body)
    )
  end
end
