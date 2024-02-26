# frozen_string_literal: true

class OverridesDeviseTokenAuthPasswordsControllerOverrideTest < Rhino::TestCase::Override
  test "devise_token_auth passwords controller is overridden" do
    assert_overridden "#{__dir__}/../../../app/overrides/devise_token_auth/passwords_controller_override.rb",
                      DeviseTokenAuth::PasswordsController, :render_edit_error
  end
end
