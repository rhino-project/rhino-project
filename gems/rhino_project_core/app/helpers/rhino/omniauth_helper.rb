# frozen_string_literal: true

module Rhino
  module OmniauthHelper
    module_function

    def strategies_metadata
      params = { resource_class: "User" }

      strategies.each_with_object([]) do |strategy, array|
        array << {
          name: strategy,
          path: "#{::OmniAuth.config.path_prefix}/#{strategy}?#{params.to_param}"
        }
      end
    end

    def strategies
      strategies = ENV.keys.filter_map do |env|
        match = /AUTH_(.*)_CLIENT_ID/.match(env)
        next unless match

        match[1].downcase.to_sym
      end.uniq

      strategies += [:developer] if Rails.env.development? && !Rake.try(:application)

      strategies
    end

    def app_info(strategy)
      case strategy
      when :developer
        []
      when :azure_oauth2
        azure_info
      when :auth0
        auth0_info
      else
        env_keys(strategy)
      end
    end

    def env_keys(strategy)
      ups = strategy.to_s.upcase
      [ENV["AUTH_#{ups}_CLIENT_ID"], ENV["AUTH_#{ups}_SECRET_KEY"]]
    end

    def azure_info
      [
        client_id: ENV["AUTH_AZURE_OAUTH2_CLIENT_ID"],
        client_secret: ENV["AUTH_AZURE_OAUTH2_SECRET_KEY"],
        tenant_id: ENV["AUTH_AZURE_OAUTH2_TENANT_ID"]
      ]
    end

    def auth0_info
      [client_id: ENV["AUTH_AUTH0_CLIENT_ID"],
       client_secret: ENV["AUTH_AUTH0_SECRET_KEY"],
       domain: ENV["AUTH_AUTH0_DOMAIN"],
       callback_path: "/api/auth/omniauth/auth0/callback",
       authorize_params: {
         scope: "openid profile"
       }]
    end
  end
end
