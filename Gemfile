source "https://rubygems.org"

ruby "3.3.5"

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem "rails", "~> 7.1.3", ">= 7.1.3.4"

# The original asset pipeline for Rails [https://github.com/rails/sprockets-rails]
gem "sprockets-rails"
gem "sassc-rails"

# Use postgresql as the database for Active Record
gem "pg", "~> 1.1"

# Use the Puma web server [https://github.com/puma/puma]
gem "puma", ">= 5.0"

# Use Redis adapter to run Action Cable in production
gem "redis", ">= 4.0.1"

# Use Kredis to get higher-level data types in Redis [https://github.com/rails/kredis]
# gem "kredis"

# Use Active Model has_secure_password [https://guides.rubyonrails.org/active_model_basics.html#securepassword]
# gem "bcrypt", "~> 3.1.7"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[ windows jruby ]

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", require: false

# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
gem "image_processing", "~> 1.2"

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem "debug", platforms: %i[ mri windows ]

  gem "openapi3_parser"

  gem "factory_bot"
  gem "factory_bot_rails"

  # These are aligned with rails 7.1
  gem "rubocop", "1.63.3", require: false
  gem "rubocop-performance", "1.21.0", require: false
  gem "rubocop-minitest", "0.29.0", require: false
  gem "rubocop-rails", "2.18.0", require: false

  gem "rubocop-factory_bot", "2.26.1", require: false
  gem "rubocop-rhino-project", "~> 0.21.0.beta.35", require: false

  gem "ffaker"
  gem "simplecov", require: false
  gem "webmock", require: false
end

group :development do
  # Use console on exceptions pages [https://github.com/rails/web-console]
  gem "web-console"

  # Add speed badges [https://github.com/MiniProfiler/rack-mini-profiler]
  # gem "rack-mini-profiler"

  # Speed up commands on slow machines / big apps [https://github.com/rails/spring]
  # gem "spring"

  gem "error_highlight", ">= 0.4.0", platforms: [:ruby]

  gem "brakeman", require: false
  gem "railroady"

  gem "letter_opener"
end

gem "dalli"

gem "sendgrid-ruby"
gem "sendgrid-actionmailer"

gem "dotenv-rails"

gem "arctic_admin"
gem "activeadmin_addons"

gem "rollbar"

gem "rhino_project", "~> 0.21.0.beta.35"

gem "rhino_project_core", "~> 0.21.0.beta.35"

gem "rhino_project_organizations", "~> 0.21.0.beta.35"

gem "rhino_project_notifications", "~> 0.21.0.beta.35"

gem "rhino_project_subscriptions", "~> 0.21.0.beta.35"

gem "rhino_project_jobs", "~> 0.21.0.beta.35"

gem "vite_rails", "~> 3.0"
