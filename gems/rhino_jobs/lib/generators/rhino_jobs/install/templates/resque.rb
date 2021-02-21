# frozen_string_literal: true

Rails.application.configure do
  Resque.redis = ENV['REDIS_URL'] || 'localhost:6379'

  # https://github.com/rails/rails/issues/16933
  yaml_schedule = YAML.load_file(Rails.root.join('config/resque_schedule.yml')) || {}
  wrapped_schedule = ActiveScheduler::ResqueWrapper.wrap yaml_schedule
  Resque.schedule  = wrapped_schedule
end
