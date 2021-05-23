# frozen_string_literal: true

class OverridesDeviseTokenAuthOmniauthCallbacksControllerOverrideTest < ActiveSupport::TestCase
  test "devise_token_auth omniauth callbacks controller is overridden" do
    assert_equal File.realpath("#{__dir__}/../../../app/overrides/devise_token_auth/omniauth_callbacks_controller_override.rb"),
                 DeviseTokenAuth::OmniauthCallbacksController.new.method(:omniauth_success).source_location[0]
  end
end
