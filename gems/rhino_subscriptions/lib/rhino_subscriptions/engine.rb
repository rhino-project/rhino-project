# frozen_string_literal: true

require 'rhino/engine'
require 'active_support'

module RhinoSubscriptions
  class Engine < ::Rails::Engine
    config.autoload_paths << File.expand_path('../../lib', __dir__)

    initializer 'rhino_subscriptions.register_module' do
      config.after_initialize do
        if ENV['STRIPE_SECRET_KEY']
          Rhino.registered_modules[:rhino_subscriptions] = {
            version: RhinoSubscriptions::VERSION
          }
        end
      end
    end
  end
end
