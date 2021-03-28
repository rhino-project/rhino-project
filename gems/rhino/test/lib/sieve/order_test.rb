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

  def seed
    @current_user = create :user
    @blog = create :blog, user: @current_user
    @middle_instance = create :blog_post, blog: @blog, created_at: Time.zone.now
    @oldest_instance = create :blog_post, blog: @blog, created_at: Time.zone.now - 1.day
    @newest_instance = create :blog_post, blog: @blog, created_at: Time.zone.now + 1.day
  end

  def fetch
    get url, params: { "order" => @params }, headers: @headers
    assert_response :ok
    @json = JSON.parse(@response.body)
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
    seed
    instances = BlogPost.all
    assert_equal @newest_instance.id, instances[0].id
    assert_equal @middle_instance.id, instances[1].id
    assert_equal @oldest_instance.id, instances[2].id
  end

  test "order[created_at] overrides default_ordering to created_at ASC" do
    seed
    sign_in
    @params = "created_at"
    fetch

    instances = @json["results"]
    assert_equal @oldest_instance.id, instances[0]["id"]
    assert_equal @middle_instance.id, instances[1]["id"]
    assert_equal @newest_instance.id, instances[2]["id"]
  end

  test "order[-created_at] overrides default ordering to created_at DESC" do
    seed
    sign_in
    @params = "-created_at"
    fetch

    instances = @json["results"]
    assert_equal @newest_instance.id, instances[0]["id"]
    assert_equal @middle_instance.id, instances[1]["id"]
    assert_equal @oldest_instance.id, instances[2]["id"]
  end

  test "ordering by non-existing columns should ignore order param and use default ordering" do
    seed
    sign_in
    @params = "zzzcreated_atzzz"
    fetch

    instances = @json["results"]
    assert_equal @newest_instance.id, instances[0]["id"]
    assert_equal @middle_instance.id, instances[1]["id"]
    assert_equal @oldest_instance.id, instances[2]["id"]
  end

  test "ordering works for aliased fields like created_at <> aliased_creation_date" do
    seed
    sign_in
    @params = "aliased_creation_date"
    fetch

    instances = @json["results"]
    assert_equal @oldest_instance.id, instances[0]["id"]
    assert_equal @middle_instance.id, instances[1]["id"]
    assert_equal @newest_instance.id, instances[2]["id"]
  end
end
