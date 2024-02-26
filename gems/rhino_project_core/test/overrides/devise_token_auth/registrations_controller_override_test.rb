# frozen_string_literal: true

require "test_helper"
require "minitest/autorun"

class OverridesDeviseTokenAuthRegistrationsControllerOverrideTest < Rhino::TestCase::Override
  test "devise_token_auth registrations controller is overridden" do
    assert_overridden "#{__dir__}/../../../app/overrides/devise_token_auth/registrations_controller_override.rb",
                      DeviseTokenAuth::RegistrationsController, :create
  end
end

class DeviseTokenAuthRegistrationsControllerOverrideTest < Rhino::TestCase::ControllerTest
  test "user can sign up when allowed" do
    register_user

    assert_response_ok
  end

  test "user cannot sign up when not allowed" do
    Rhino.stub :allow_signup, false do
      register_user
    end

    assert_response_unauthorized
  end

  private
    def register_user
      post_api user_registration_path,
               params: {
                 email: "test@example.com",
                 password: "password",
                 password_confirmation: "password"
               }
    end
end
