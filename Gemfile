# frozen_string_literal: true

source "https://rubygems.org"

gem "minitest", ">= 5.15.0", "< 5.22.0"

# We need a newish Rake since Active Job sets its test tasks' descriptions.
gem "rake", ">= 13"

gem "sprockets-rails", ">= 2.0.0"
gem "propshaft", ">= 0.1.7"
gem "capybara", ">= 3.39"
gem "selenium-webdriver", ">= 4.11.0"

gem "rack-cache", "~> 1.2"
gem "stimulus-rails"
gem "turbo-rails"
gem "jsbundling-rails"
gem "cssbundling-rails"
gem "importmap-rails", ">= 1.2.3"
gem "dartsass-rails"
# require: false so bcrypt is loaded only when has_secure_password is used.
# This is to avoid Active Model (and by extension the entire framework)
# being dependent on a binary library.
gem "bcrypt", "~> 3.1.11", require: false

# This needs to be with require false to avoid it being automatically loaded by
# sprockets.
gem "terser", ">= 1.1.4", require: false

# Explicitly avoid 1.x that doesn't support Ruby 2.4+
gem "json", ">= 2.0.0", "!=2.7.0"

# Workaround until Ruby ships with cgi version 0.3.6 or higher.
gem "cgi", ">= 0.3.6", require: false

gem "prism"

group :lint do
  gem "syntax_tree", "6.1.1", require: false
end

group :rubocop do
  # These are aligned with rails 7.0
  gem 'rubocop', '1.24.1', require: false
  gem 'rubocop-packaging', '0.5.1', require: false
  gem 'rubocop-performance', '1.13.1', require: false
  gem 'rubocop-minitest', '0.17.0', require: false
  gem 'rubocop-rails', '2.13.0', require: false
end

group :mdl do
  gem "mdl", "!= 0.13.0", require: false
end

group :development, :test do
  gem 'factory_bot'
  gem 'factory_bot_rails'
  gem 'ffaker'
  gem 'openapi3_parser'
  gem 'webmock', require: false
end

gem "useragent", require: false

# Add your own local bundler stuff.
local_gemfile = File.expand_path(".Gemfile", __dir__)
instance_eval File.read local_gemfile if File.exist? local_gemfile

group :test do
  gem "minitest-bisect", require: false
  gem "minitest-ci", require: false
  gem "minitest-retry"

  platforms :mri do
    gem "stackprof"
    gem "debug", ">= 1.1.0", require: false
  end

  # Needed for Railties tests because it is included in generated apps.
  gem "brakeman"
end

platforms :ruby, :windows do
  gem "nokogiri", ">= 1.8.1", "!= 1.11.0"

  # Needed for compiling the ActionDispatch::Journey parser.
  gem "racc", ">=1.4.6", require: false

  # Active Record.
  group :db do
    gem "pg", "~> 1.3"
  end
end

gem "tzinfo-data", platforms: [:windows, :jruby]
gem "wdm", ">= 0.1.0", platforms: [:windows]
