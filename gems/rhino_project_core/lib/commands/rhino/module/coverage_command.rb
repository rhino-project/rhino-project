# frozen_string_literal: true

require "dotenv"
require "rails/command"

module Rails
  module Command
    module Rhino
      module Module
        class CoverageCommand < Base # :nodoc:
          include Thor::Actions

          def perform(*args)
            ENV["COVERAGE"] = "1"
            test(*args)
          end

          protected
            def rhino_command(extra_path, base_command, *args) # rubocop:todo Metrics/MethodLength
              module_name = if Dir.exist?(args[0])
                args.shift
              else
                abort "No module specified"
              end
              module_path = [module_name, extra_path].compact.join("/")
              db_name = "#{module_name}_dummy"
              gem_file_path = File.join(Dir.pwd, "Gemfile")

              # Getting existing variables and re-use
              ::Dotenv.load

              inside(module_path) do
                # Override DB_NAME so multiple can run in parallel
                run(
                  "DB_NAME=#{db_name} BUNDLE_GEMFILE='#{gem_file_path}' bin/rails #{base_command} #{args.join(' ')}",
                  { abort_on_failure: true }
                )
              end
            end
        end
      end
    end
  end
end
