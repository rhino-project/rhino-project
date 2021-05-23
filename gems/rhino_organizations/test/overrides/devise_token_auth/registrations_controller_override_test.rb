# frozen_string_literal: true

class OverridesDeviseTokenAuthRegistrationsControllerOverrideTest < ActiveSupport::TestCase
  test "devise_token_auth registrations controller is overridden" do
    assert_equal File.realpath("#{__dir__}/../../../app/overrides/devise_token_auth/registrations_controller_override.rb"),
                 DeviseTokenAuth::RegistrationsController.new.method(:create).source_location[0]
  end
end
