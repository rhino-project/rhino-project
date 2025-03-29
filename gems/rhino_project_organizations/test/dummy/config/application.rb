# frozen_string_literal: true

require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

require 'rhino_project_core'
require 'rhino_project_organizations'

module Dummy
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 8.0

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w[assets tasks])

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    config.action_controller.allow_forgery_protection = false

    # Error indexes for nested attribute errors
    # https://github.com/rails/rails/pull/48727
    config.active_record.index_nested_attribute_errors = :nested_attributes_order

    # Necessary for ActiveStorage integration
    # Rhino::Resource::ActiveStorageExtension#url needs this to be set
    Rails.application.routes.default_url_options[:host] = ENV["RHINO_APP_URL"]
  end
end
