# frozen_string_literal: true

class OverridesDeviseTokenAuthPasswordsControllerOverrideTest < ActiveSupport::TestCase
  test "devise_token_auth passwords controller is overridden" do
    assert_equal File.realpath("#{__dir__}/../../../app/overrides/devise_token_auth/passwords_controller_override.rb"),
                 DeviseTokenAuth::PasswordsController.new.method(:render_edit_error).source_location[0]
  end
end
