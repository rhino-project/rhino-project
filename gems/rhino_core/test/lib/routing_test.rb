# frozen_string_literal: true

require 'test_helper'

class RoutingTest < ActiveSupport::TestCase
  test 'Global owned resources routes are index/show only' do
    assert_equal(%i[index show], Category.routes)
  end

  test 'Resources routes are CRUD' do
    assert_equal(%i[index create show update destroy], Blog.routes)
  end

  test 'Frontend class route' do
    assert_equal('/blogPosts', BlogPost.route_frontend)
  end

  test 'Frontend instance route' do
    b = BlogPost.create(title: 'test')
    assert_equal b.route_frontend, "/blogPosts/#{b.id}"
  end

  test 'API class route' do
    assert_equal('/api/blog_posts', BlogPost.route_api)
  end

  test 'API instance route' do
    b = BlogPost.create(title: 'test')
    assert_equal b.route_api, "/api/blog_posts/#{b.id}"
  end
end
