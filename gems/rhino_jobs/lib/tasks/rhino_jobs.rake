# frozen_string_literal: true

require 'resque/tasks'
require 'resque/scheduler/tasks'

namespace :resque do
  # Ensure initializers for resque:work so redis url is set
  task setup: :environment

  task setup_schedule: :setup do
    require 'resque-scheduler'

    # https://github.com/rails/rails/issues/16933
    yaml_schedule = YAML.load_file(Rails.root.join('config/resque_schedule.yml')) || {}
    wrapped_schedule = ActiveScheduler::ResqueWrapper.wrap yaml_schedule
    Resque.schedule  = wrapped_schedule
  end

  task scheduler: :setup_schedule
end

namespace :rhino_jobs do
  # Prevent migration installation task from showing up twice.
  Rake::Task['rhino_jobs_engine:install:migrations'].clear_comments if Rake::Task.task_defined?('rhino_jobs_engine:install:migrations')

  desc 'Install rhino_jobs'
  task install: :environment do
    Rake::Task['rhino_jobs_engine:install:migrations'].invoke if Rake::Task.task_defined?('rhino_jobs_engine:install:migrations')

    Rails::Command.invoke :generate, ['rhino_jobs:install']
  end
end
