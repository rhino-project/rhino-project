# frozen_string_literal: true

require "test_helper"

class BaseControllerNonExistingTokenCookieTest < Rhino::TestCase::ControllerTest
  test "returns 401 when client send cookie with invalid token" do
    prepare
    assert_response_unauthorized
  end

  test "clears cookie when cookie is invalid" do
    prepare
    assert_deleted_cookie DeviseTokenAuth.cookie_name
  end

  private
    def prepare
      sign_in
      delete_user_tokens
      users_index
    end
end

class BaseControllerAbsentCookieTest < Rhino::TestCase::ControllerTest
  test "returns 401 when client doesn't send cookie" do
    prepare
    assert_response_unauthorized
  end

  test "does not clear cookie when cookie is not sent" do
    prepare
    assert_nil response.cookies[DeviseTokenAuth.cookie_name]
  end

  private
    def prepare
      users_index
    end
end

class BaseControllerForbiddenTest < Rhino::TestCase::ControllerTest
  test "returns 403 when client doesn't have permission" do
    prepare
    assert_response_forbidden
  end

  test "does not clear cookie when forbidden" do
    prepare
    assert_not_deleted_cookie DeviseTokenAuth.cookie_name
  end

  private
    def prepare
      @user = create :user
      sign_in @user
      @another_user = create :user
      delete_api user_path(@another_user)
    end
end
