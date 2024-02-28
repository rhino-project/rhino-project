# frozen_string_literal: true

require "test_helper"

class OrganizationsIndexSuccessTest < Rhino::TestCase::OrganizationControllerTest
  test "returns 200 when successful and user doesn't have any orgs" do
    prepare
    assert_equal 0, @current_user.organizations.count
    assert_response_ok
  end

  test "returns 200 when successful and user has orgs" do
    prepare_with_organization
    assert_equal 1, @current_user.organizations.count
    assert_response_ok
  end
end

class OrganizationsIndexSerializationTest < Rhino::TestCase::OrganizationControllerTest
  test "serializes id correctly" do
    prepare_with_organization
    assert_equal @current_organization.id, parsed_response["results"][0]["id"]
  end

  test "serializes name correctly" do
    prepare_with_organization
    assert_equal @current_organization.name, parsed_response["results"][0]["name"]
  end

  test "serializes display_name correctly" do
    prepare_with_organization
    assert_equal @current_organization.display_name, parsed_response["results"][0]["display_name"]
  end
end

class OrganizationsIndexTimestampsSerializationTest < Rhino::TestCase::OrganizationControllerTest
  test "serializes created_at correctly" do
    prepare_with_organization
    assert_equal @current_organization.created_at.strftime("%Y-%m-%dT%H:%M:%S.%LZ"), parsed_response["results"][0]["created_at"]
  end

  test "serializes updated_at correctly" do
    prepare_with_organization
    assert_equal @current_organization.updated_at.strftime("%Y-%m-%dT%H:%M:%S.%LZ"), parsed_response["results"][0]["updated_at"]
  end
end

class OrganizationsIndexPermissionsSerializationTest < Rhino::TestCase::OrganizationControllerTest
  test "serializes can_current_user_edit correctly" do
    prepare_with_organization
    assert_includes [true, false], parsed_response["results"][0]["can_current_user_edit"]
  end

  test "serializes can_current_user_destroy correctly" do
    prepare_with_organization
    assert_includes [true, false], parsed_response["results"][0]["can_current_user_edit"]
  end
end

class OrganizationsIndexRoleSerializationTest < Rhino::TestCase::OrganizationControllerTest
  test "serializes role's name correctly" do
    prepare_with_organization
    assert_equal @current_role.name, parsed_response["results"][0]["users_roles"][0]["role"]["name"]
  end
end
