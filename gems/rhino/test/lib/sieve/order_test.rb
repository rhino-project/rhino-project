# frozen_string_literal: true

require "test_helper"

class RhinoSieveOrderTestHelper < ActionDispatch::IntegrationTest
  protected
  def setup
    seed
    sign_in
  end

  def sign_in
    post "/api/auth/sign_in", params: {
      email: @current_user.email,
      password: @current_user.password
    }, as: :json
    @headers = { "access-token" => @response.headers["access-token"],
                 "uid" => @response.headers["uid"],
                 "client" => @response.headers["client"] }
  end

  def seed # rubocop:disable Metrics/AbcSize
    @current_user = create :user
    @blog = create :blog, user: @current_user, published_at: Time.zone.now
    @middle_instance = create :blog_post, blog: @blog, created_at: Time.zone.now
    @oldest_instance = create :blog_post, blog: @blog, created_at: 1.day.ago
    @newest_instance = create :blog_post, blog: @blog, created_at: 1.day.from_now
    @oldest_blog = create :blog, user: @current_user, published_at: 1.day.ago
    @null_blog = create :blog, user: @current_user, published_at: nil
  end

  def fetch(url = self.url, filter: nil, search: nil)
    params = { "order" => @params }
    params["filter"] = filter if filter
    params["search"] = search if search
    get url, params: params, headers: @headers
    assert_response :ok
    @json = JSON.parse(@response.body)
  end

  def assert_order(results, *instances)
    instances.each_with_index do |instance, idx|
      assert_equal instance.id, results[idx]["id"]
    end
  end
end

class RhinoSieveOrderBasicTest < RhinoSieveOrderTestHelper
  def url
    "/api/blog_posts"
  end

  test "does not fail when order param is nil" do
    @params = nil
    fetch
  end

  test "does not fail when order param is empty string" do
    @params = ""
    fetch
  end

  test "does not fail when order param is a string containing only spaces" do
    @params = "   "
    fetch
  end
end

class RhinoSieveOrderMultipleClausesTest < RhinoSieveOrderTestHelper
  def url
    "/api/blog_posts"
  end

  def seed # rubocop:disable Metrics/AbcSize
    @current_user = create :user
    @blog = create :blog, user: @current_user, published_at: Time.zone.now

    now = Time.zone.now
    @instance1 = create :blog_post, blog: @blog, created_at: Time.zone.now, updated_at: now
    @instance2 = create :blog_post, blog: @blog, created_at: 1.day.ago, updated_at: now
    @instance3 = create :blog_post, blog: @blog, created_at: 1.day.from_now, updated_at: now - 1.day
  end

  test "ordering sieve works with two clauses" do
    @params = "updated_at,-created_at"
    fetch

    assert_order @json["results"], @instance3, @instance1, @instance2

    @params = "-updated_at,created_at"
    fetch

    assert_order @json["results"], @instance2, @instance1, @instance3
  end
end

class RhinoSieveOrderTest < RhinoSieveOrderTestHelper
  def url
    "/api/blog_posts"
  end

  test "BlogPost.all sql orders by created_at DESC" do
    assert_match(/ORDER BY .*created_at.? DESC/, BlogPost.all.to_sql)
  end

  test "BlogPost default scope orders by created_at DESC" do
    results = BlogPost.all
    assert_order results, @newest_instance, @middle_instance, @oldest_instance
  end

  test "order[created_at] overrides default_ordering to created_at ASC" do
    @params = "created_at"
    fetch

    assert_order @json["results"], @oldest_instance, @middle_instance, @newest_instance
  end

  test "order[-created_at] overrides default ordering to created_at DESC" do
    @params = "-created_at"
    fetch

    assert_order @json["results"], @newest_instance, @middle_instance, @oldest_instance
  end

  test "ordering by non-existing columns should ignore order param and use default ordering" do
    @params = "zzzcreated_atzzz"
    fetch

    assert_order @json["results"], @newest_instance, @middle_instance, @oldest_instance
  end

  test "ordering works for aliased fields like created_at <> aliased_creation_date" do
    @params = "aliased_creation_date"
    fetch

    assert_order @json["results"], @oldest_instance, @middle_instance, @newest_instance
  end

  test "ordering puts nulls last for asc" do
    @params = "published_at"
    fetch("/api/blogs")

    assert_order @json["results"], @oldest_blog, @blog, @null_blog
  end

  test "ordering puts nulls last for desc" do
    @params = "-published_at"
    fetch("/api/blogs")

    assert_order @json["results"], @blog, @oldest_blog, @null_blog
  end
end

class RhinoSieveOrderRelatedModelsTest < RhinoSieveOrderTestHelper
  def url
    "/api/og_meta_tags"
  end

  # rubocop:disable Metrics/AbcSize
  def seed
    @current_user = create :user

    now = Time.zone.now
    @newest_blog1 = create :blog, user: @current_user, published_at: now
    @newest_blog2 = create :blog, user: @current_user, published_at: now
    @oldest_blog = create :blog, user: @current_user, published_at: now - 1.day

    @middle_blog_post = create :blog_post, blog: @oldest_blog, created_at: Time.zone.now
    @oldest_blog_post = create :blog_post, blog: @newest_blog2, created_at: 1.day.ago
    @newest_blog_post = create :blog_post, blog: @newest_blog1, created_at: 1.day.from_now

    @middle_instance = create :og_meta_tag, blog_post: @middle_blog_post
    @oldest_instance = create :og_meta_tag, blog_post: @oldest_blog_post
    @newest_instance = create :og_meta_tag, blog_post: @newest_blog_post
  end
  # rubocop:enable Metrics/AbcSize

  test "ignores order clauses with invalid nested models" do
    @params = "blog_post.created_at"
    fetch

    assert_order @json["results"], @oldest_instance, @middle_instance, @newest_instance

    @params = "blog_post.invalid_model.name,blog_post.created_at"
    fetch

    assert_order @json["results"], @oldest_instance, @middle_instance, @newest_instance
  end

  test "ordering through related model attribute works" do
    @params = "blog_post.created_at"
    fetch

    assert_order @json["results"], @oldest_instance, @middle_instance, @newest_instance

    @params = "-blog_post.created_at"
    fetch

    assert_order @json["results"], @newest_instance, @middle_instance, @oldest_instance
  end

  test "combining multiple ordering clauses through related model works" do
    @params = "blog_post.blog.published_at,blog_post.created_at"
    fetch

    assert_order @json["results"], @middle_instance, @oldest_instance, @newest_instance

    @params = "blog_post.blog.published_at,-blog_post.created_at"
    fetch

    assert_order @json["results"], @middle_instance, @newest_instance, @oldest_instance

    @params = "-blog_post.blog.published_at,blog_post.created_at"
    fetch

    assert_order @json["results"], @oldest_instance, @newest_instance, @middle_instance

    @params = "-blog_post.created_at,-blog_post.blog.published_at"
    fetch

    assert_order @json["results"], @newest_instance, @middle_instance, @oldest_instance
  end

  test "works combined with the filter sieve" do
    @params = "blog_post.created_at"
    fetch filter: { blog_post: { created_at: { gt: "1970-01-01" } } }

    assert_order @json["results"], @oldest_instance, @middle_instance, @newest_instance
  end

  test "works combined with the search sieve" do
    @params = "blog_post.created_at"
    fetch search: @oldest_instance.blog_post.title

    assert_order @json["results"], @oldest_instance
  end
end
