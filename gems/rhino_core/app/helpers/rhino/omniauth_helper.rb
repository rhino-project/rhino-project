# frozen_string_literal: true

module Rhino
  module OmniauthHelper
    def self.strategies
      strategies = ENV.keys.map do |env|
        match = /AUTH_(.*)_CLIENT_ID/.match(env)
        next unless match

        match[1].downcase.to_sym
      end.compact.uniq

      strategies += [:developer] if Rails.env.development? && !Rake.try(:application)

      strategies
    end

    def self.app_info(strategy)
      return [] if strategy == :developer

      ups = strategy.to_s.upcase
      [ENV["AUTH_#{ups}_CLIENT_ID"], ENV["AUTH_#{ups}_SECRET_KEY"]] unless strategy == :developer
    end
  end
end
