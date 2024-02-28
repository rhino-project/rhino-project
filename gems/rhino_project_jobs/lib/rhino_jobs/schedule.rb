# frozen_string_literal: true

require "resque-scheduler"

# https://github.com/rails/rails/issues/16933
module RhinoJobs
  module Schedule
    module_function

    SCHEDULE_FILE = Rails.root.join("config/resque_schedule.yml")

    def load
      return unless File.exist?(SCHEDULE_FILE)

      yaml_schedule = YAML.load_file(SCHEDULE_FILE) || {}
      wrapped_schedule = ActiveScheduler::ResqueWrapper.wrap yaml_schedule
      Resque.schedule  = wrapped_schedule
    end
  end
end
