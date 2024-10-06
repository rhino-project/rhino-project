# frozen_string_literal: true

require "test_helper"

class BaseControllerNonExistingTokenCookieTest < Rhino::TestCase::ControllerTest
  def setup
    sign_in
    delete_user_tokens
    users_index
  end

  test "returns 401 when client send cookie with invalid token" do
    assert_response_unauthorized
  end

  test "clears cookie when cookie is invalid" do
    assert_deleted_cookie DeviseTokenAuth.cookie_name
  end
end

class BaseControllerAbsentCookieTest < Rhino::TestCase::ControllerTest
  def setup
    users_index
  end

  test "returns 401 when client doesn't send cookie" do
    assert_response_unauthorized
  end

  test "does not clear cookie when cookie is not sent" do
    assert_nil response.cookies[DeviseTokenAuth.cookie_name]
  end
end

class BaseControllerForbiddenTest < Rhino::TestCase::ControllerTest
  def setup
    @user = create(:user)
    sign_in @user
    @another_user = create(:user)
    delete_api user_path(@another_user)
  end

  test "returns 403 when client doesn't have permission" do
    assert_response_forbidden
  end

  test "does not clear cookie when forbidden" do
    assert_not_deleted_cookie DeviseTokenAuth.cookie_name
  end
end
