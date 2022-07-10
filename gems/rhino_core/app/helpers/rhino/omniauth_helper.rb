# frozen_string_literal: true

module Rhino
  module OmniauthHelper
    module_function

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
        [client_id: ENV["AUTH_AZURE_OAUTH2_CLIENT_ID"],
         client_secret: ENV["AUTH_AZURE_OAUTH2_SECRET_KEY"],
         tenant_id: ENV["AUTH_AZURE_OAUTH2_TENANT_ID"]]
      else
        env_keys(strategy)
      end
    end

    def env_keys(strategy)
      ups = strategy.to_s.upcase
      [ENV["AUTH_#{ups}_CLIENT_ID"], ENV["AUTH_#{ups}_SECRET_KEY"]]
    end
  end
end
