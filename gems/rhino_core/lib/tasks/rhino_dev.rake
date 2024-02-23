# frozen_string_literal: true

namespace :rhino do
  namespace :dev do
    desc "Setup Rhino development environment"
    task setup: :environment do
      # Extract extra arguments from ARGV
      extra_args = ARGV.drop_while { |arg| arg != "--" }.drop(1)

      # Remove extra arguments from ARGV to prevent interference with other tasks
      extra_args.each { |arg| ARGV.delete(arg) }
      ARGV.delete("--")

      Rails::Command.invoke :generate, ["rhino:dev:setup", *extra_args]
    end
  end
end
