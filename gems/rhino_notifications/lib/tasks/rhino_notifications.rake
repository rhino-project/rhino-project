# frozen_string_literal: true

namespace :rhino_notifications do
  # Prevent migration installation task from showing up twice.
  if Rake::Task.task_defined?('rhino_notifications_engine:install:migrations')
    Rake::Task['rhino_notifications_engine:install:migrations'].clear_comments
  end

  desc 'Install rhino_notifications'
  task install: :environment do
    Rake::Task['rhino_notifications_engine:install:migrations'].invoke if Rake::Task.task_defined?('rhino_notifications_engine:install:migrations')

    Rails::Command.invoke :generate, ['rhino_notifications:install']
  end
end
