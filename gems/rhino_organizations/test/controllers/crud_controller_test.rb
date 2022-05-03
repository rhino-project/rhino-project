# frozen_string_literal: true

require "test_helper"

class OrganizationsCrudControllerTest < Rhino::TestCase::OrganizationControllerTest
  def setup
    super

    sign_in_with_organization
    @blog = create :blog, author: @current_user, organization: @current_organization
  end

  test "index returns results" do
    get blogs_path, xhr: true, as: :json

    assert_response_ok
    assert_equal 1, parsed_response["total"]
    assert_equal @blog.title, parsed_response["results"][0]["title"]
  end

  test "show returns resource" do
    get blog_path(@blog), xhr: true, as: :json

    assert_response_ok
    assert_equal @blog.id, parsed_response["id"]
    assert_equal @blog.title, parsed_response["title"]
  end

  test "creates and returns resource" do
    blog_attr = attributes_for(:blog).merge(organization: @current_organization.id)

    assert_difference "Blog.count", 1 do
      post blogs_path, params: blog_attr, xhr: true, as: :json
    end

    assert_response_ok
    assert_equal blog_attr[:title], parsed_response["title"]
  end

  test "updates and returns resource" do
    updated_title = attributes_for(:blog)[:title]

    patch blog_path(@blog), params: { title: updated_title }, xhr: true, as: :json

    assert_response_ok
    assert_equal @blog.id, parsed_response["id"]
    assert_equal updated_title, parsed_response["title"]
  end

  test "destroys and returns resource" do
    assert_difference "Blog.count", -1 do
      delete blog_path(@blog), xhr: true, as: :json
    end

    assert_response_ok
    assert_equal @blog.id, parsed_response["id"]
    assert_equal @blog.title, parsed_response["title"]
  end
end

class CrudControllerUnauthorizedTest < Rhino::TestCase::OrganizationControllerTest
  def setup
    super

    sign_in_with_organization

    @another_user = create(:user)
    @another_organization = create(:organization)
    @blog = create :blog, author: @another_user, organization: @another_organization
  end

  test "index does not contain resource for another user" do
    get blogs_path, xhr: true, as: :json

    assert_response_ok
    assert_equal 0, parsed_response["total"]
  end

  test "show does not find resource for another user" do
    get blog_path(@blog), xhr: true, as: :json

    assert_response_not_found
  end

  test "creates does not create resource for another user" do
    blog_attr = attributes_for(:blog).merge(author: @another_user.id)

    assert_no_difference "Blog.count" do
      post blogs_path, params: blog_attr, xhr: true, as: :json
    end

    assert_response_forbidden
  end

  test "cannot update blog for another user" do
    updated_title = attributes_for(:blog)[:title]

    patch blog_path(@blog), params: { title: updated_title }, xhr: true, as: :json

    assert_response_forbidden
  end

  test "cannot destroy blog for another user" do
    assert_no_difference "Blog.count" do
      delete blog_path(@blog), xhr: true, as: :json
    end

    assert_response_forbidden
  end
end

class OrganizationsCrudControllerTestUnauthenticatedTest < Rhino::TestCase::OrganizationControllerTest
  def setup
    super

    sign_in_with_organization
    sign_out

    @blog = create :blog, author: @current_user, organization: @current_organization
  end

  test "index unauthorized for unauthenticated user" do
    get blogs_path, xhr: true, as: :json

    assert_response_unauthorized
  end

  test "show unauthorized for unauthenticated user" do
    get blog_path(@blog), xhr: true, as: :json

    assert_response_unauthorized
  end

  test "create unauthorized for unauthenticated user" do
    blog_attr = attributes_for(:blog).merge(author: @current_user.id)

    assert_no_difference "Blog.count" do
      post blogs_path, params: blog_attr, xhr: true, as: :json
    end

    assert_response_unauthorized
  end

  test "uppdate unauthorized for unauthenticated user" do
    updated_title = attributes_for(:blog)[:title]

    patch blog_path(@blog), params: { title: updated_title }, xhr: true, as: :json

    assert_response_unauthorized
  end

  test "destroy unauthorized for unauthenticated user" do
    assert_no_difference "Blog.count" do
      delete blog_path(@blog), xhr: true, as: :json
    end

    assert_response_unauthorized
  end
end
