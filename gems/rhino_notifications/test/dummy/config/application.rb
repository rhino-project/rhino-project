require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)
require "rhino_notifications"

module Dummy
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.1

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins '*'
        resource '*',
          :headers => :any,
          :methods => [:get, :post, :put, :patch, :delete, :options],
          expose: ['access-token', 'client', 'uid']
      end
    end

    config.action_controller.allow_forgery_protection = false

    # Error indexes for nested attribute errors
    # https://blog.bigbinary.com/2016/07/07/errors-can-be-indexed-with-nested-attrbutes-in-rails-5.html
    config.active_record.index_nested_attribute_errors = true
  end
end
