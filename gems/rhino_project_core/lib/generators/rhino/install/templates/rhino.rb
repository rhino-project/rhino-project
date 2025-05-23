# frozen_string_literal: true

Rhino.setup do |config|
  # ==> Owner configuration
  # The auth owner class
  # config.auth_owner = 'User'

  # The base owner class
  # config.base_owner = 'Organization'

  # ==> Resource Configuration

  # Include Rhino::Resource::ActiveRecordExtension by default
  # config.auto_include_active_record = true

  # The root path for the api ie '/api'
  # config.namespace = :api

  # Authentication
  # config.allow_signup = true

  # ==> Canonical Property Configuration
  # Override default properties for canonical property (default: %w[title name])
  # config.canonical_defaults += %w[my_usual_name]

  # The list of resources exposed in the API
  config.resources += ['User', 'Account']
end
