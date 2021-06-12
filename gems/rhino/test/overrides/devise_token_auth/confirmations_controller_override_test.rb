# frozen_string_literal: true

class OverridesDeviseTokenAuthConfirmationsControllerOverrideTest < Rhino::TestCase::Override
  test "devise_token_auth confirmations controller is overridden" do
    assert_overridden "#{__dir__}/../../../app/overrides/devise_token_auth/confirmations_controller_override.rb",
                      DeviseTokenAuth::ConfirmationsController, :show
  end
end
