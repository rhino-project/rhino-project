# frozen_string_literal: true

require "dotenv"
require "rails/command"

module Rails
  module Command
    module Rhino
      module Module
        class NewCommand < Base # :nodoc:
          no_commands do
            def help
              run_module_generator %w[--help]
            end
          end

          def self.banner(*) # :nodoc:
            "#{executable} new [options]"
          end

          def perform(*args)
            run_module_generator(args)
          end

          private
            def run_module_generator(plugin_args)
              require "generators/rhino/module/module_generator"
              ::Rhino::Generators::ModuleGenerator.start plugin_args
            end
        end
      end
    end
  end
end
