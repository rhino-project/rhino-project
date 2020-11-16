# frozen_string_literal: true

namespace :rhino_organizations do
  # Prevent migration installation task from showing up twice.
  Rake::Task['rhino_organizations_engine:install:migrations'].clear_comments

  desc 'Install Rhino Organizations'
  task install: %w[environment run_installer copy_migrations]

  task run_installer: :environment do
    installer_template = File.expand_path('../rails/generators/installer.rb', __dir__)
    system "#{RbConfig.ruby} ./bin/rails app:template LOCATION=#{installer_template}"
  end

  task copy_migrations: :environment do
    Rake::Task['rhino_organizations_engine:install:migrations'].invoke
  end
end
