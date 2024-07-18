require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module RhinoTemplate
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    #Raises an ArgumentError when an unpermitted open redirect occurs.
    # Default value for target_version prior 7.0 was false, but now it is true
    #https://edgeguides.rubyonrails.org/configuring.html#config-action-controller-raise-on-open-redirects
    config.action_controller.raise_on_open_redirects = false

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # https://guides.rubyonrails.org/engines.html#overriding-models-and-controllers
    overrides = "#{Rails.root}/app/overrides"
    Rails.autoloaders.main.ignore(overrides)
    config.to_prepare do
      Dir.glob("#{overrides}/**/*_override.rb").each do |override|
        load override
      end
    end

    # Keep mini_magick for now
    config.active_storage.variant_processor = :mini_magick

    # Return gzip compressed responses
    config.middleware.use Rack::Deflater

    config.action_controller.allow_forgery_protection = false

    # Error indexes for nested attribute errors
    # https://blog.bigbinary.com/2016/07/07/errors-can-be-indexed-with-nested-attrbutes-in-rails-5.html
    config.active_record.index_nested_attribute_errors = true

    # Necessary for ActiveStorage integration
    # Rhino::Resource::ActiveStorageExtension#url needs this to be set
    Rails.application.routes.default_url_options[:host] = ENV["ROOT_URL"]
  end
end
