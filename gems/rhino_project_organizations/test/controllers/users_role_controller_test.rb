# frozen_string_literal: true

require "test_helper"

class UsersRoleControllerTest < Rhino::TestCase::OrganizationControllerTest
  test "should return status 200 when an admin updates any user_role" do
    sign_in_with_organization_and_admin_user

    any_role = create(:role, name: "any")
    another_role = create(:role, name: "another")
    user_role = create(:users_role, role: any_role, organization: @current_organization)
    patch_api users_role_path(user_role), params: { role: another_role.id }

    assert_response_ok
  end

  test "should return status 403 when NON admin user updates any user_role" do
    sign_in_with_organization_and_non_admin_user

    any_role = create(:role, name: "any")
    another_role = create(:role, name: "another")
    user_role = create(:users_role, role: any_role, organization: @current_organization)
    patch_api users_role_path(user_role), params: { role: another_role.id }

    assert_response_forbidden
  end

  test "should return status 422 when single admin updates their user_role" do
    sign_in_with_organization_and_admin_user

    any_role = create(:role, name: "any")
    patch_api users_role_path(@current_user_role), params: { role: any_role.id }

    assert_response 422
  end

  test "should return status 200 when an admin deletes any user_role" do
    sign_in_with_organization_and_admin_user

    any_role = create(:role, name: "any")
    user_role = create(:users_role, role: any_role, organization: @current_organization)
    delete_api users_role_path(user_role)

    assert_response_ok
  end

  test "should return status 403 when NON admin user deletes any user_role" do
    sign_in_with_organization_and_non_admin_user

    any_role = create(:role, name: "any")
    user_role = create(:users_role, role: any_role, organization: @current_organization)
    delete_api users_role_path(user_role)

    assert_response_forbidden
  end

  test "should return status 422 when single admin deletes their user_role" do
    sign_in_with_organization_and_admin_user

    delete_api users_role_path(@current_user_role)

    assert_response 422
  end
end
