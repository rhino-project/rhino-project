# frozen_string_literal: true

class OverridesDeviseTokenAuthRegistrationsControllerOverrideTest < Rhino::TestCase::Override
  test "devise_token_auth registrations controller is overridden" do
    assert_overridden "#{__dir__}/../../../app/overrides/devise_token_auth/registrations_controller_override.rb",
                      DeviseTokenAuth::RegistrationsController, :create
  end
end
