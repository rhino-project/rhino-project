# frozen_string_literal: true

require "test_helper"

class SignOutSuccessTest < Rhino::TestCase::ControllerTest
  test "returns 200 when successful" do
    prepare
    assert_response_ok
  end

  test "deletes token when successful" do
    prepare
    assert_equal 0, @current_user.reload.tokens.size
  end

  test "clears cookie when successful" do
    prepare
    assert_deleted_cookie DeviseTokenAuth.cookie_name
  end

  private
    def prepare
      sign_in
      assert_equal 1, @current_user.reload.tokens.size
      sign_out
    end
end

class SignOutNonExistingTokenTest < Rhino::TestCase::ControllerTest
  test "returns 404 when token doesn't exist" do
    prepare
    assert_response_not_found
  end

  test "clears cookie when token doesn't exist" do
    prepare
    assert_deleted_cookie DeviseTokenAuth.cookie_name
  end

  private
    def prepare
      sign_in
      delete_user_tokens
      sign_out
    end
end

class SignOutAbsentCookieTest < Rhino::TestCase::ControllerTest
  test "returns 404 when cookie is not sent" do
    prepare
    assert_response_not_found
  end

  test "clears cookie when cookie is not sent" do
    prepare
    assert_deleted_cookie DeviseTokenAuth.cookie_name
  end

  private
    def prepare
      sign_in
      # doesn't send the auth cookie in the request
      sign_out headers: empty_auth_cookie_header
    end
end
