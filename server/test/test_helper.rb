# frozen_string_literal: true

require "simplecov"

ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

require "rhino/test_case"
require "rhino_organizations/test_case"

class ActiveSupport::TestCase
  # Run tests in parallel with specified workers
  parallelize(workers: :number_of_processors)

  parallelize_setup do |worker|
    SimpleCov.command_name "#{SimpleCov.command_name}-#{worker}"

    ActiveStorage::Blob.service.root = "#{ActiveStorage::Blob.service.root}-#{worker}"
  end

  parallelize_teardown do |_worker|
    SimpleCov.result

    # https://guides.rubyonrails.org/active_storage_overview.html#cleaning-up-fixtures
    FileUtils.rm_rf(ActiveStorage::Blob.services.fetch(:test).root)
  end

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
  include FactoryBot::Syntax::Methods
end
