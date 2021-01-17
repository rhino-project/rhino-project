# frozen_string_literal: true

namespace :rhino do
  # Prevent migration installation task from showing up twice.
  Rake::Task['rhino_engine:install:migrations'].clear_comments

  desc 'Install Rhino'
  task install: %w[environment run_installer copy_migrations]

  desc 'Export Rhino Open API information for client'
  task open_api_export: :environment do
    File.open('static.js', 'w') do |f|
      f.write "const api = #{Rhino::OpenApiInfo.index};\n\n"
      f.write("export default api;\n")
    end
  end

  task run_installer: :environment do
    installer_template = File.expand_path('../rails/generators/installer.rb', __dir__)
    system "#{RbConfig.ruby} ./bin/rails app:template LOCATION=#{installer_template}"
  end

  task copy_migrations: :environment do
    Rake::Task['rhino_engine:install:migrations'].invoke
  end
end
