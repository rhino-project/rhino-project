# frozen_string_literal: true

module Rhino
  module Generators
    class ModuleGenerator < ::Rails::Generators::Base
      attr_reader :module_name, :module_path

      class_option :full, type: :boolean, default: false,
                          desc: 'Full plugin generation'

      class_option :skip_plugin, type: :boolean, default: false,
                                 desc: 'Skip plugin generation'

      source_root File.expand_path('templates', __dir__)

      def create_module
        @module_name = ask('Module name?')
        @module_name = "rhino_#{module_name}" unless module_name.starts_with?('rhino_')
        @module_path = "rhino/#{module_name}"

        return if options[:skip_plugin]

        say "Creating #{module_name}"

        plugin_command = "plugin new #{module_path}"
        plugin_command = "#{plugin_command} --full" if options[:full]
        rails_command(plugin_command)
      end

      def remove_license
        remove_file "#{module_path}/MIT-LICENSE"
      end

      def engine_registration
        engine_file = "#{module_path}/lib/#{module_name}/engine.rb"

        remove_file engine_file
        template 'engine.rb', engine_file
      end

      def create_install_generator
        generator_path = "#{module_path}/lib/generators/#{module_name}/install"
        tasks_path = "#{module_path}/lib/tasks"

        empty_directory "#{generator_path}/templates"
        create_file("#{generator_path}/templates/.keep")

        template 'install_generator.rb', "#{generator_path}/install_generator.rb"
        template 'module_tasks.rake', "#{tasks_path}/#{module_name}.rake"

        remove_file "#{tasks_path}/#{module_name}_tasks.rake"
      end

      def fix_gemspec
        gemspec_file = "#{module_path}/#{module_name}.gemspec"

        gsub_file gemspec_file, /spec.homepage.*/, 'spec.homepage    = ""'
        gsub_file gemspec_file, /spec.summary.*/, 'spec.summary     = ""'
        gsub_file gemspec_file, /spec.description.*/, 'spec.description = ""'
        gsub_file gemspec_file, /spec.license.*/, 'spec.license      = ""'
        gsub_file gemspec_file, 'spec.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]', 'spec.files = Dir["{app,config,db,lib}/**/*", "Rakefile", "README.md"]' # rubocop:disable Layout/LineLength
      end

      # Gross hack for now
      DUMMY_SETUP_FILES = [
        'config/database.yml',
        'config/initializers/devise_token_auth.rb',
        'config/initializers/devise.rb',
        'app/models/user.rb',
        'db/migrate/20210111014230_devise_token_auth_create_users.rhino_engine.rb'
      ].freeze

      def dummy_setup
        return unless options[:full]

        rhino_dummy = Rails.root.join('rhino/rhino/test/dummy')
        module_dummy = Rails.root.join("#{module_path}/test/dummy")

        remove_file "#{module_dummy}/config/database.yml"

        DUMMY_SETUP_FILES.each do |file|
          copy_file "#{rhino_dummy}/#{file}", "#{module_dummy}/#{file}"
        end
      end

      def rubocop
        inside(module_path) do
          run 'bundle exec rubocop -a', capture: true
        end
      end
    end
  end
end
