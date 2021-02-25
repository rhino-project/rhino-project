# frozen_string_literal: true

namespace :rhino_subscriptions do
  # Prevent migration installation task from showing up twice.
  if Rake::Task.task_defined?('rhino_subscriptions_engine:install:migrations')
    Rake::Task['rhino_subscriptions_engine:install:migrations'].clear_comments
  end

  desc 'Install rhino_subscriptions'
  task install: :environment do
    Rake::Task['rhino_subscriptions_engine:install:migrations'].invoke if Rake::Task.task_defined?('rhino_subscriptions_engine:install:migrations')

    Rails::Command.invoke :generate, ['rhino_subscriptions:install']
  end
end
