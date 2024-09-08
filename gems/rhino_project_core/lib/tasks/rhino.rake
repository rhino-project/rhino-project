# frozen_string_literal: true

namespace :rhino do
  # Prevent migration installation task from showing up twice.
  Rake::Task["rhino_engine:install:migrations"].clear_comments

  desc "Install Rhino"
  task install: %w[environment run_installer]

  desc "Export Rhino Open API information for client"
  task open_api_export: :environment do
    static_file = Rails.root.parent.join("app", "frontend", "models", "static.js")
    File.open(static_file, "w") do |f|
      f.write "const api = #{Rhino::OpenApiInfo.index};\n\n"
      f.write("export default api;\n")
    end
  end

  task run_installer: :environment do
    Rake::Task["rhino_engine:install:migrations"].invoke if Rake::Task.task_defined?("rhino_engine:install:migrations")

    Rails::Command.invoke :generate, ["rhino:install"]
  end
end
