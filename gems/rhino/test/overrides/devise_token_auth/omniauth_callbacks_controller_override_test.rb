# frozen_string_literal: true

class OverridesDeviseTokenAuthOmniauthCallbacksControllerOverrideTest < Rhino::TestCase::Override
  test "devise_token_auth omniauth callbacks controller is overridden" do
    assert_overridden "#{__dir__}/../../../app/overrides/devise_token_auth/omniauth_callbacks_controller_override.rb",
                      DeviseTokenAuth::OmniauthCallbacksController, :omniauth_success
  end
end
