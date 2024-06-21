# frozen_string_literal: true

require "rhino/engine"
require "rhino_notifications/version"

# https://guides.rubyonrails.org/engines.html#other-gem-dependencies
require "activity_notification"

module RhinoNotifications
  class Engine < ::Rails::Engine
    config.autoload_paths << File.expand_path("../../lib", __dir__)

    initializer "rhino_notifications.register_module" do
      config.after_initialize do
        if File.exist?(Rails.root.join("config/initializers/activity_notification.rb"))
          Rhino.registered_modules[:rhino_notifications] = {
            version: RhinoNotifications::VERSION::STRING
          }
        end
      end
    end
  end
end
