# frozen_string_literal: true

require 'test_helper'

class RoutingTest < ActiveSupport::TestCase
  test 'Global owned resources routes are index/show only' do
    assert_equal Category.routes, %i[index show]
  end

  test 'Resources routes are CRUD' do
    assert_equal Blog.routes, %i[index create show update destroy]
  end

  test 'Frontend class route' do
    assert_equal BlogPost.route_frontend, '/blogPosts'
  end

  test 'Frontend instance route' do
    b = BlogPost.create(title: 'test')
    assert_equal b.route_frontend, "/blogPosts/#{b.id}"
  end

  test 'API class route' do
    assert_equal BlogPost.route_api, '/api/blog_posts'
  end

  test 'API instance route' do
    b = BlogPost.create(title: 'test')
    assert_equal b.route_api, "/api/blog_posts/#{b.id}"
  end
end
