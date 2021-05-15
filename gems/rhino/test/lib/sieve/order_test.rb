# frozen_string_literal: true

class RhinoSieveOrderTestHelper < ActionDispatch::IntegrationTest
  protected
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
    @oldest_instance = create :blog_post, blog: @blog, created_at: Time.zone.now - 1.day
    @newest_instance = create :blog_post, blog: @blog, created_at: Time.zone.now + 1.day
    @oldest_blog = create :blog, user: @current_user, published_at: Time.zone.now - 1.day
    @null_blog = create :blog, user: @current_user, published_at: nil
  end

  def fetch(url = self.url)
    get url, params: { "order" => @params }, headers: @headers
    assert_response :ok
    @json = JSON.parse(@response.body)
  end
end

class RhinoSieveOrderTest < RhinoSieveOrderTestHelper
  def url
    "/api/blog_posts"
  end

  def assert_order(results, *instances)
    instances.each_with_index do |instance, idx|
      assert_equal instance.id, results[idx]["id"]
    end
  end

  test "BlogPost.all sql orders by created_at DESC" do
    assert_match(/ORDER BY .*created_at.? DESC/, BlogPost.all.to_sql)
  end

  test "BlogPost default scope orders by created_at DESC" do
    seed
    results = BlogPost.all
    assert_order results, @newest_instance, @middle_instance, @oldest_instance
  end

  test "order[created_at] overrides default_ordering to created_at ASC" do
    seed
    sign_in
    @params = "created_at"
    fetch

    assert_order @json["results"], @oldest_instance, @middle_instance, @newest_instance
  end

  test "order[-created_at] overrides default ordering to created_at DESC" do
    seed
    sign_in
    @params = "-created_at"
    fetch

    assert_order @json["results"], @newest_instance, @middle_instance, @oldest_instance
  end

  test "ordering by non-existing columns should ignore order param and use default ordering" do
    seed
    sign_in
    @params = "zzzcreated_atzzz"
    fetch

    assert_order @json["results"], @newest_instance, @middle_instance, @oldest_instance
  end

  test "ordering works for aliased fields like created_at <> aliased_creation_date" do
    seed
    sign_in
    @params = "aliased_creation_date"
    fetch

    assert_order @json["results"], @oldest_instance, @middle_instance, @newest_instance
  end

  test "ordering puts nulls last for asc" do
    seed
    sign_in
    @params = "published_at"
    fetch("/api/blogs")

    assert_order @json["results"], @oldest_blog, @blog, @null_blog
  end

  test "ordering puts nulls last for desc" do
    seed
    sign_in
    @params = "-published_at"
    fetch("/api/blogs")

    assert_order @json["results"], @blog, @oldest_blog, @null_blog
  end
end
