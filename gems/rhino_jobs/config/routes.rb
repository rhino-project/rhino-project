require 'resque/server'
require 'resque-scheduler'
require 'resque/scheduler/server'

Rails.application.routes.draw do
  authenticate :admin_user do
    mount Resque::Server, at: '/jobs'
  end
end
