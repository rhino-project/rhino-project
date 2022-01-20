require_relative 'boot'

require 'rails/all'

Bundler.require(*Rails.groups)
require "rhino_subscriptions"

module Dummy
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.1

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.

    config.action_controller.allow_forgery_protection = false

    # Error indexes for nested attribute errors
    # https://blog.bigbinary.com/2016/07/07/errors-can-be-indexed-with-nested-attrbutes-in-rails-5.html
    config.active_record.index_nested_attribute_errors = true

    # Necessary for ActiveStorage integration
    # Rhino::Resource::ActiveStorageExtension#url needs this to be set
    Rails.application.routes.default_url_options[:host] = ENV["ROOT_URL"]
  end
end
