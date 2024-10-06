# frozen_string_literal: true

require "test_helper"

class DefaultRoutingControllerTest < ActionDispatch::IntegrationTest
  test "root redirects to frontend" do
    send(:get, "/")

    assert_response :success
  end
end
