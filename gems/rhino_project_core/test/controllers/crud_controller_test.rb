# frozen_string_literal: true

require "test_helper"

class CrudControllerTest < Rhino::TestCase::ControllerTest
  def setup
    super

    sign_in
    @blog = create :blog, user: @current_user
  end

  test "index returns results" do
    get_api blogs_path

    assert_response_ok
    assert_equal 1, parsed_response["total"]
    assert_equal @blog.title, parsed_response["results"][0]["title"]
  end

  test "show returns resource" do
    get_api blog_path(@blog)

    assert_response_ok
    assert_equal @blog.id, parsed_response["id"]
    assert_equal @blog.title, parsed_response["title"]
  end

  test "creates and returns resource" do
    blog_attr = attributes_for(:blog).merge(user: @current_user.id)

    assert_difference "Blog.count", 1 do
      post_api blogs_path, params: blog_attr
    end

    assert_response_ok
    assert_equal blog_attr[:title], parsed_response["title"]
  end

  test "updates and returns resource" do
    updated_title = attributes_for(:blog)[:title]

    patch_api blog_path(@blog), params: { title: updated_title }

    assert_response_ok
    assert_equal @blog.id, parsed_response["id"]
    assert_equal updated_title, parsed_response["title"]
  end

  test "destroys and returns resource" do
    assert_difference "Blog.count", -1 do
      delete_api blog_path(@blog)
    end

    assert_response_ok
    assert_equal @blog.id, parsed_response["id"]
    assert_equal @blog.title, parsed_response["title"]
  end
end

class CrudControllerUnauthorizedTest < Rhino::TestCase::ControllerTest
  def setup
    super

    sign_in

    @another_user = create(:user)
    @blog = create :blog, user: @another_user
  end

  test "index does not contain resource for another user" do
    get_api blogs_path

    assert_response_ok
    assert_equal 0, parsed_response["total"]
  end

  test "show does not find resource for another user" do
    get_api blog_path(@blog)

    assert_response_not_found
  end

  test "creates does not create resource for another user" do
    blog_attr = attributes_for(:blog).merge(user: @another_user.id)

    assert_no_difference "Blog.count" do
      post_api blogs_path, params: blog_attr
    end

    assert_response_forbidden
  end

  test "cannot update blog for another user" do
    updated_title = attributes_for(:blog)[:title]

    patch_api blog_path(@blog), params: { title: updated_title }

    assert_response_forbidden
  end

  test "cannot destroy blog for another user" do
    assert_no_difference "Blog.count" do
      delete_api blog_path(@blog)
    end

    assert_response_forbidden
  end
end

class CrudControllerUnauthenticatedTest < Rhino::TestCase::ControllerTest
  def setup
    super

    sign_in
    sign_out

    @blog = create :blog, user: @current_user
  end

  test "index unauthorized for unauthenticated user" do
    get_api blogs_path

    assert_response_unauthorized
  end

  test "show unauthorized for unauthenticated user" do
    get_api blog_path(@blog)

    assert_response_unauthorized
  end

  test "create unauthorized for unauthenticated user" do
    blog_attr = attributes_for(:blog).merge(user: @current_user.id)

    assert_no_difference "Blog.count" do
      post_api blogs_path, params: blog_attr
    end

    assert_response_unauthorized
  end

  test "update unauthorized for unauthenticated user" do
    updated_title = attributes_for(:blog)[:title]

    patch_api blog_path(@blog), params: { title: updated_title }

    assert_response_unauthorized
  end

  test "destroy unauthorized for unauthenticated user" do
    assert_no_difference "Blog.count" do
      delete_api blog_path(@blog)
    end

    assert_response_unauthorized
  end
end
