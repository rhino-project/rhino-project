# frozen_string_literal: true

namespace :rhino_organizations do
  # Prevent migration installation task from showing up twice.
  if Rake::Task.task_defined?('rhino_organizations_engine:install:migrations')
    Rake::Task['rhino_organizations_engine:install:migrations'].clear_comments
  end

  desc 'Install rhino_organizations'
  task install: :environment do
    Rake::Task['rhino_organizations_engine:install:migrations'].invoke if Rake::Task.task_defined?('rhino_organizations_engine:install:migrations')

    Rails::Command.invoke :generate, ['rhino_organizations:install']
  end
end
