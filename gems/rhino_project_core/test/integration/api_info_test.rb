# frozen_string_literal: true

require "test_helper"

class ApiInfoTest < ActionDispatch::IntegrationTest
  test "can retrieve the open api info" do
    get "/api/info/openapi", as: :json

    assert_response :success
    assert_equal("3.0.3", response.parsed_body["openapi"])
  end
end
