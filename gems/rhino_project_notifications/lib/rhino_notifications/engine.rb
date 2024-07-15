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

    # https://guides.rubyonrails.org/engines.html#overriding-models-and-controllers
    # Use root instead of Rails.root to scope for this engine
    initializer "rhino_notifications.overrides" do
      overrides = "#{root}/app/overrides"
      Rails.autoloaders.main.ignore(overrides)

      config.to_prepare do
        # FIXME: Only necessary because this module is in tree NUB-682
        if Rhino.resources.include?("Organization")
          Dir.glob("#{overrides}/**/*_override.rb").each do |override|
            load override
          end
        end
      end
    end
  end
end
