# frozen_string_literal: true

require 'dotenv'
require 'rails/command'

module Rails
  module Command
    class RhinoCommand < Base # :nodoc:
      include Thor::Actions

      no_commands do
        def help
          say 'rails rhino::dummy [module] command # Run rails command in dummy application, defaults to rhino'
        end
      end

      def dummy(*args)
        # Default to just rhino/rhino if no obvious module
        module_name = if Dir.exist?("rhino/rhino_#{args[0]}")
                        args.shift
                      else
                        nil
                      end
        module_base = ['rhino', module_name].compact.join('_')
        module_path = "rhino/#{module_base}/test/dummy"
        db_name = "#{module_base}_dummy"

        # Getting existing variables and re-use
        ::Dotenv.load

        inside(module_path) do
          # Override DB_NAME so multiple can run in parallel
          run "DB_NAME=#{db_name} BUNDLE_GEMFILE='../../../../Gemfile' bin/rails #{args.join(' ')}"
        end
      end
    end
  end
end
