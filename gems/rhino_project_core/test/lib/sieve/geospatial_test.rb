# frozen_string_literal: true

require "test_helper"

class RhinoSieveGeospatialTestHelper < Rhino::TestCase::ControllerTest
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

    def seed
      @current_user = create(:user)
      @omaha = Geospatial.create!(user: @current_user, latitude: 41.2565, longitude: -95.9345)
      @toronto = Geospatial.create!(user: @current_user, latitude: 43.6532, longitude: -79.3832)
    end

    def url
      "/api/geospatials"
    end

    def fetch(url = self.url, filter: nil, search: nil)
      params = { "geospatial" => @params }
      params["filter"] = filter if filter
      params["search"] = search if search
      get url, params:, headers: @headers
      assert_response :ok
      @json = JSON.parse(@response.body)
    end

    def assert_order(results, *instances)
      instances.each_with_index do |instance, idx|
        assert_equal instance.id, results[idx]["id"]
      end
    end
end

class RhinoSieveGeospatialBasicTest < RhinoSieveGeospatialTestHelper
  test "does not fail when geospatial param is nil" do
    @params = nil
    fetch
  end

  test "does not fail when geospatial param is empty string" do
    @params = ""
    fetch
  end

  test "does not fail when geospatial param is a string containing only spaces" do
    @params = "   "
    fetch
  end
end

class RhinoSieveGeospatialTest < RhinoSieveGeospatialTestHelper
  test "near location by latitude and longitude" do
    @params = { near: { location: { latitude: 41.2565, longitude: -95.9345 }, max_distance: 10 } }
    fetch
    assert_equal [@omaha.id], parsed_response_ids
  end

  test "near location by latitude and longitude with long distance" do
    @params = { near: { location: { latitude: 41.2565, longitude: -95.9345 }, max_distance: 2000 } }
    fetch
    assert_equal [@omaha.id, @toronto.id].sort, parsed_response_ids.sort
  end

  test "near location by address" do
    @params = { near: { location: "Omaha, NE, US", max_distance: 10 } }
    fetch
    assert_equal [@omaha.id], parsed_response_ids
  end

  test "near location by address with long distance" do
    @params = { near: { location: "Omaha, NE, US", max_distance: 2000 } }
    fetch
    assert_equal [@omaha.id, @toronto.id].sort, parsed_response_ids.sort
  end
end
