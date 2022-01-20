# frozen_string_literal: true

require "simplecov" if ENV["COVERAGE"]

# Configure Rails Environment
ENV["RAILS_ENV"] = "test"

require_relative "../test/dummy/config/environment"
ActiveRecord::Migrator.migrations_paths = [File.expand_path("../test/dummy/db/migrate", __dir__)]
require "rails/test_help"

require "rhino/test_case"

# Filter out the backtrace from minitest while preserving the one from other libraries.
Minitest.backtrace_filter = Minitest::BacktraceFilter.new

# Load fixtures from the engine
if ActiveSupport::TestCase.respond_to?(:fixture_path=)
  ActiveSupport::TestCase.fixture_path = File.expand_path("fixtures", __dir__)
  ActionDispatch::IntegrationTest.fixture_path = ActiveSupport::TestCase.fixture_path
  ActiveSupport::TestCase.file_fixture_path = ActiveSupport::TestCase.fixture_path + "/files"
  ActiveSupport::TestCase.fixtures :all
end

# Load all test helpers
# https://guides.rubyonrails.org/testing.html#eagerly-requiring-helpers
# But we are in an engine so use that root - Rails.root would point to dummy
Dir[Rhino::Engine.root.join("test", "test_helpers", "**", "*.rb")].sort.each { |file| require file }

class ActiveSupport::TestCase
  # Run tests in parallel with specified workers
  parallelize(workers: :number_of_processors)

  # make each process running tests a separate command for simple cov.
  # in the end, they will all get merged and not overwrite each other's results
  # https://github.com/simplecov-ruby/simplecov/issues/718#issuecomment-538201587

  parallelize_setup do |worker|
    SimpleCov.command_name "#{SimpleCov.command_name}-#{worker}" if ENV["COVERAGE"]

    # https://guides.rubyonrails.org/active_storage_overview.html#discarding-files-created-during-tests
    ActiveStorage::Blob.service.root = "#{ActiveStorage::Blob.service.root}-#{worker}"
  end

  parallelize_teardown do |_worker|
    SimpleCov.result if ENV["COVERAGE"]

    # https://guides.rubyonrails.org/active_storage_overview.html#cleaning-up-fixtures
    FileUtils.rm_rf(ActiveStorage::Blob.services.fetch(:test).root)
  end

  # Add more helper methods to be used by all tests here...
  include FactoryBot::Syntax::Methods
end
