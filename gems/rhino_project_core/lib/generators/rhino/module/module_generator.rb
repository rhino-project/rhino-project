# frozen_string_literal: true

require "rails/generators"
require "rails/generators/rails/plugin/plugin_generator"
require "rhino/version"

module Rhino
  module Generators
    class ModuleBuilder < ::Rails::PluginBuilder
      def lib
        template "lib/%namespaced_name%.rb"
        template "lib/%namespaced_name%/version.rb"

        template "lib/%namespaced_name%/engine.rb"

        # The install generator
        empty_directory_with_keep_file "lib/generators/#{namespaced_name}/install/templates"
        template "lib/generators/%namespaced_name%/install/install_generator.rb"
        template "lib/tasks/%namespaced_name%_tasks.rake"
      end

      # FIXME: Hack because the engine.rb file is over aggressive in its checks
      def rhino_hack
        template "test/dummy/config/initializers/devise.rb"
        template "test/dummy/config/initializers/devise_token_auth.rb"
        template "test/dummy/app/models/user.rb"
        remove_file "test/dummy/config/database.yml"
        template "test/dummy/config/database.yml"
      end
    end

    class ModuleGenerator < ::Rails::Generators::PluginGenerator
      source_root File.expand_path("templates", __dir__)

      class_option :database, type: :string, aliases: "-d", default: "postgresql"
      remove_class_option :template

      def self.banner
        "rails rhino:module #{arguments.map(&:usage).join(' ')} [options]"
      end

      # Parent source paths
      def source_paths
        [
          File.expand_path("templates", __dir__),
          Rails::Generators::PluginGenerator.source_root
        ]
      end

      # Has to be named this way as it overrides the default
      def get_builder_class # rubocop:disable Naming/AccessorMethodName
        ModuleBuilder
      end

      def rhino_version
        ::Rhino::VERSION::STRING
      end

      def rhino_setup
        return unless with_dummy_app?

        build(:rhino_hack)

        inside(rails_app_path) do
          run "rails rhino:module:dummy #{namespaced_name} rhino:install"
          run "rails rhino:module:dummy #{namespaced_name} db:create"
          run "rails rhino:module:dummy #{namespaced_name} db:migrate"
        end
      end

      def rubocop
        template ".rubocop.yml"

        inside(File.join(rails_app_path, namespaced_name)) do
          run "bundle exec rubocop -A ", capture: true
        end
      end
    end
  end
end
