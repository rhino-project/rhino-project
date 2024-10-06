# frozen_string_literal: true

require "test_helper"

class SignOutSuccessTest < Rhino::TestCase::ControllerTest
  def setup
    sign_in
  end

  test "returns 200 when successful" do
    sign_out

    assert_response_ok
  end

  test "deletes token when successful" do
    assert_changes -> { @current_user.reload.tokens.size }, from: 1, to: 0 do
      sign_out
    end
  end

  test "clears cookie when successful" do
    sign_out

    assert_deleted_cookie DeviseTokenAuth.cookie_name
  end
end

class SignOutNonExistingTokenTest < Rhino::TestCase::ControllerTest
  def setup
    sign_in
    delete_user_tokens
    sign_out
  end

  test "returns 404 when token doesn't exist" do
    assert_response_not_found
  end

  test "clears cookie when token doesn't exist" do
    assert_deleted_cookie DeviseTokenAuth.cookie_name
  end
end

class SignOutAbsentCookieTest < Rhino::TestCase::ControllerTest
  def setup
    sign_in
    # doesn't send the auth cookie in the request
    sign_out headers: empty_auth_cookie_header
  end

  test "returns 404 when cookie is not sent" do
    assert_response_not_found
  end

  test "clears cookie when cookie is not sent" do
    assert_deleted_cookie DeviseTokenAuth.cookie_name
  end
end
