# frozen_string_literal: true

require "test_helper"

class TestBaseController < Rhino::BaseController
  def index
    raise StandardError, "Boom!"
  end
end

class BaseControllerTest < Rhino::TestCase::ControllerTest
  def setup
    sign_in

    Rails.application.routes.draw do
      get "/test_error", to: "test_base#index"
    end
  end

  def teardown
    Rails.application.reload_routes!
  end

  test "raises error in test environment" do
    assert_raises(StandardError, "Boom!") do
      get "/test_error"
    end
  end

  test "returns 500 in non-test environments" do
    Rails.env.stub :test?, false do
      get "/test_error"
      assert_response :internal_server_error
      assert_equal({ "errors" => ["Internal server error."] }, JSON.parse(response.body))
    end
  end
end
