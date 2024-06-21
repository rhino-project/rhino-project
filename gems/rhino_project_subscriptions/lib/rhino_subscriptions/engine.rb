# frozen_string_literal: true

require "active_support"
require "rhino/engine"
require "rhino_subscriptions/version"

# https://guides.rubyonrails.org/engines.html#other-gem-dependencies
require "stripe"

module RhinoSubscriptions
  class Engine < ::Rails::Engine
    config.autoload_paths << File.expand_path("../../lib", __dir__)

    initializer "rhino_subscriptions.register_module" do
      config.after_initialize do
        if ENV["STRIPE_SECRET_KEY"]
          Rhino.registered_modules[:rhino_subscriptions] = {
            version: RhinoSubscriptions::VERSION::STRING
          }
        end
      end
    end
  end
end
