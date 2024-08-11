# frozen_string_literal: true

require "test_helper"

class RoutingTest < ActiveSupport::TestCase
  test "Frontend instance route for a Model that belongs directly to the base owner Model should include base owner Model id" do
    instance = create(:blog)
    assert_equal "/#{instance.organization.id}/blogs/#{instance.id}", instance.route_frontend
  end

  test "Frontend instance route for a Model that belongs to the base owner Model through another Model should include base owner Model id" do
    instance = create(:blog_post)
    assert_equal "/#{instance.blog.organization.id}/blogPosts/#{instance.id}", instance.route_frontend
  end

  test "Frontend instance route for a Model that is the base owner Model should NOT include base owner Model id" do
    instance = create(:organization)
    assert_equal "/organizations/#{instance.id}", instance.route_frontend
  end

  test "Frontend instance route for a Model that doesn't have a clear single pathto the base owner Model should NOT include base owner Model id" do
    instance = create(:user)
    assert_equal "/users/#{instance.id}", instance.route_frontend
  end
end
