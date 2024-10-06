# frozen_string_literal: true

require "test_helper"

class ActiveAdminLoginTest < ActionDispatch::IntegrationTest
  def setup
    @admin_user = create(:admin_user)
    @user = create(:user)
  end

  test "admin user can log in" do
    post admin_user_session_path, params: {
      admin_user: {
        email: @admin_user.email,
        password: @admin_user.password
      }
    }
    follow_redirect!

    assert_response :success
    assert_select "h2", "Dashboard"
  end

  test "regular user cannot log in" do
    get admin_root_path, params: {
      admin_user: {
        email: @user.email,
        password: @user.password
      }
    }

    assert_redirected_to new_admin_user_session_path
  end

  test "unauthenticated user is redirected to login" do
    get admin_root_path

    assert_redirected_to new_admin_user_session_path
  end
end
