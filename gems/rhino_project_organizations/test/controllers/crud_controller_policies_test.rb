# frozen_string_literal: true

require "test_helper"

class CrudControllerViewerPolicyTest < Rhino::TestCase::OrganizationControllerPolicyTest
  def setup
    sign_in_org_users_and_resource("viewer")
  end

  test "index returns results" do
    policy_index_success
  end

  test "show returns resource" do
    policy_show_success
  end

  test "show does return resource for another organization" do
    policy_show_fail(@another_resource)
  end

  test "create does not create resource" do
    blog_attr = attributes_for(:blog).merge(organization: @current_organization.id)

    policy_create_fail(blog_attr)
  end

  test "create does not create resource for another organizations" do
    blog_attr = attributes_for(:blog)

    policy_create_fail(blog_attr)
  end

  test "cannot update blog for another user" do
    updated_title = attributes_for(:blog)[:title]

    policy_update_fail({ title: updated_title })
  end

  test "cannot destroy blog" do
    policy_destroy_fail
  end

  test "cannot destroy blog for another organization" do
    policy_destroy_fail(@another_resource)
  end
end

class CrudControllerAdminPolicyTest < Rhino::TestCase::OrganizationControllerPolicyTest
  def setup
    sign_in_org_users_and_resource
  end

  test "index returns results" do
    policy_index_success
  end

  test "show returns resource" do
    policy_show_success
  end

  test "show does not return blog for another organization" do
    policy_show_fail(@another_resource)
  end

  test "create creates blog" do
    blog_attr = attributes_for(:blog).merge(organization: @current_organization.id)

    policy_create_success(blog_attr)
  end

  test "create does not create blog for another organizations" do
    blog_attr = attributes_for(:blog)

    policy_create_fail(blog_attr)
  end

  test "can update blog" do
    updated_title = attributes_for(:blog)[:title]

    policy_update_success({ title: updated_title })
  end

  test "can destroy blog" do
    policy_destroy_success
  end

  test "cannot destroy blog for another organization" do
    policy_destroy_fail(@another_resource)
  end
end

class CrudControllerEditorPolicyTest < Rhino::TestCase::OrganizationControllerPolicyTest
  def setup
    sign_in_org_users_and_resource("editor")
  end

  test "index returns results" do
    policy_index_success
  end

  test "show returns resource" do
    policy_show_success
  end

  test "show does not return blog for another organization" do
    policy_show_fail(@another_resource)
  end

  test "create does not create blog" do
    blog_attr = attributes_for(:blog).merge(organization: @current_organization.id)

    policy_create_fail(blog_attr)
  end

  test "create does not create blog for another organization" do
    blog_attr = attributes_for(:blog)

    policy_create_fail(blog_attr)
  end

  test "update changes blog" do
    updated_title = attributes_for(:blog)[:title]

    policy_update_success({ title: updated_title })
  end

  test "cannot destroy blog" do
    policy_destroy_fail
  end

  test "cannot destroy blog for another organization" do
    policy_destroy_fail(@another_resource)
  end
end
