# frozen_string_literal: true

require "test_helper"

class RoutingTest < ActiveSupport::TestCase
  test "Default route key" do
    assert_equal("open_api_infos", Rhino::OpenApiInfo.route_key)
  end

  test "Global owned resources routes are index/show only" do
    assert_equal(%i[index show], Category.routes)
  end

  test "Resources routes are CRUD" do
    assert_equal(%i[index create show update destroy], Blog.routes)
  end

  test "Routing path can be overriden" do
    assert_equal("info/openapi", Rhino::OpenApiInfo.route_path)
  end

  test "Frontend class route" do
    assert_equal("/blogPosts", BlogPost.route_frontend)
  end

  test "Frontend instance route with base owner id for a Model with a clear single path to the base owner Model should include base owner Model id" do
    instance = create :blog_post
    assert_equal "/#{instance.blog.user.id}/blogPosts/#{instance.id}", instance.route_frontend
  end

  test "Frontend instance route without base owner id for a Model that is the base owner Model should NOT include base owner Model id" do
    instance = create :user
    assert_equal "/users/#{instance.id}", instance.route_frontend
  end

  test "API class route" do
    assert_equal("/api/blog_posts", BlogPost.route_api)
  end

  test "API instance route" do
    b = BlogPost.create(title: "test")
    assert_equal b.route_api, "/api/blog_posts/#{b.id}"
  end
end
