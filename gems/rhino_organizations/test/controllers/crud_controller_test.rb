# frozen_string_literal: true

require "test_helper"
require_relative "../requests/organizations/organization_controller_test"

class OrganizationsCrudTest < Rhino::TestCase::OrganizationControllerTest
  test "creates blog" do
    sign_in_with_organization
    post blogs_path, params: { crud: { organization: @current_organization.id, title: "Test Blog" } }, xhr: true

    assert_response_ok
  end
end
