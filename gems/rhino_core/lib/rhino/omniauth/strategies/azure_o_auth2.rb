# frozen_string_literal: true

return unless defined?(::OmniAuth::Strategies::AzureActivedirectoryV2)

module Rhino
  module Omniauth
    module Strategies
      class AzureOAuth2 < ::OmniAuth::Strategies::AzureActivedirectoryV2
        option :name, "azure_oauth2"
        option :callback_path, "/api/auth/omniauth/azure_oauth2/callback"
      end
    end
  end
end

::OmniAuth::Strategies::AzureOauth2 = Rhino::Omniauth::Strategies::AzureOAuth2
