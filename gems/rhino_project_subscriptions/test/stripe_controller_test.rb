# frozen_string_literal: true

require "test_helper"
require "minitest/mock"
require "webmock/minitest"

class StripeControllerTest < Rhino::TestCase::ControllerTest
  def setup
    sign_in
  end

  test "prices content and authenticate check" do
    stub_request(:get, "https://api.stripe.com/v1/prices?limit=5")
      .to_return(status: 200, body: { data: [{ id: 1, nickname: "Name", unit_amount: 100 }] }.to_json, headers: {})
    get_api "/api/subscription/prices"
    price = { id: 1, name: "Name", amount: 100 }
    assert_response_ok
    assert_equal 1, parsed_response["prices"].length
    assert_equal price, parsed_response["prices"][0].symbolize_keys
    assert parsed_response.key?("publishableKey")
  end

  test "customer authenticate check" do
    stub_request(:get, "https://api.stripe.com/v1/customers?id=1")
      .to_return(status: 200, body: { data: [{ id: 1, nickname: "Name", unit_amount: 100 }] }.to_json, headers: {})
    post_api("/api/subscription/customer", params: { base_owner_id: 1 })

    assert_response_ok
  end

  test "subscriptions authenticate check" do
    get_api "/api/subscription/subscriptions"

    assert_response_ok
  end

  test "check_session_id authenticate check" do
    get_api "/api/subscription/check_session_id?base_owner_id=1"

    assert_response_ok
  end
  test "create_checkout_session authenticate check" do
    stub_request(:post, "https://api.stripe.com/v1/customers")
      .to_return(status: 200, body: { id: "1" }.to_json, headers: {})
    stub_request(:post, "https://api.stripe.com/v1/checkout/sessions")
      .to_return(status: 200, body: { id: "2" }.to_json, headers: {})
    post_api "/api/subscription/create-checkout-session", params: {
      base_owner_id: @current_user.id,
      success_url: "success_url",
      cancel_url: "cancel_url",
      price: "1"
    }

    assert_response_ok
  end
end

class StripeControllerUnauthenticatedTest < Rhino::TestCase::ControllerTest
  def setup
    sign_in
    sign_out
  end

  test "prices unauthenticate check" do
    get_api "/api/subscription/prices"

    assert_response_unauthorized
  end

  test "customer unauthenticate check" do
    post_api "/api/subscription/customer"

    assert_response_unauthorized
  end

  test "subscriptions unauthenticate check" do
    get_api "/api/subscription/subscriptions"

    assert_response_unauthorized
  end

  test "check_session_id unauthenticate check" do
    get_api "/api/subscription/check_session_id?base_owner_id=1"

    assert_response_unauthorized
  end

  test "create_checkout_session authenticate check" do
    post_api "/api/subscription/create-checkout-session"

    assert_response_unauthorized
  end
end
