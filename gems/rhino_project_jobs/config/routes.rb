require 'resque/server'
require 'resque-scheduler'
require 'resque/scheduler/server'

Rails.application.routes.draw do
  RhinoJobs::Schedule.load if Rails.configuration.active_job.queue_adapter == :resque

  authenticate :admin_user do
    mount Resque::Server, at: '/jobs'
  end
end
