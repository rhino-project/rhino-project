# frozen_string_literal: true

require "test_helper"

class RhinoSieveLimitTest < Rhino::TestCase::ControllerTest
  def setup
    sign_in

    @blog = create(:blog, user: @current_user, published_at: Time.zone.now)
    101.times { create(:blog_post, blog: @blog) }
  end

  def url
    "/api/blog_posts"
  end

  test "uses default limit when param is nil" do
    @params = nil
    fetch

    assert_limit(20)
  end

  test "uses zero limit when param is empty string" do
    @params = ""
    fetch

    assert_limit(0)
  end

  test "uses zero limit when param is a string containing only spaces" do
    @params = "   "
    fetch

    assert_limit(0)
  end

  test "uses max limit when param is larger than max limit" do
    @params = 101
    fetch

    assert_limit(100)
  end

  private
    def fetch(url = self.url, filter: nil, search: nil)
      get url, params: { "limit" => @params }, headers: @headers
      assert_response :ok
      @json = JSON.parse(@response.body)
    end

    def assert_limit(limit)
      assert_equal limit, @json["results"].count
    end
end
