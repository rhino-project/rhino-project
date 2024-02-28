# frozen_string_literal: true

require "test_helper"
require "minitest/mock"

class StripePolicyTest < Rhino::TestCase::Policy
  def setup
    @current_user = create :user
  end

  test "test create_checkout_session authentication" do
    Rhino.base_owner.stub(:roles_for_auth, ->(auth_user) { { admin: [auth_user] } }) do
      assert_permit @current_user, Rhino::StripeController, "create_checkout_session"
    end
  end

  test "test create_checkout_session authentication not permit" do
    Rhino.base_owner.stub(:roles_for_auth, ->(auth_user) { { user: [auth_user] } }) do
      assert_not_permit @current_user, Rhino::StripeController, "create_checkout_session"
    end
  end
end
