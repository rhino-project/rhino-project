# frozen_string_literal: true

module RhinoJobs
  module Generators
    class InstallGenerator < ::Rails::Generators::Base
      source_root File.expand_path('templates', __dir__)

      def install
        template 'resque.rb', 'config/initializers/resque.rb'
        template 'resque_schedule.yml', 'config/resque_schedule.yml'
        gsub_file 'config/environments/production.rb', /# config.active_job.queue_adapter.*/, 'config.active_job.queue_adapter     = :resque'
      end

      def update_procfile
        inject_into_file 'Procfile' do
          "worker: COUNT=1 QUEUE=* bin/rails resque:workers\n"
        end
        inject_into_file 'Procfile' do
          "scheduler: bin/rails resque:scheduler\n"
        end
      end

      def update_heroku_yml
        data = <<-'RUBY'
        run:
          worker:
            image: web
            command:
              - COUNT=1 QUEUE=* bin/rails resque:workers
          scheduler:
            image: web
            command:
              - bin/rails resque:scheduler
        RUBY
        inject_into_file 'heroku.yml', optimize_indentation(data, 0)
      end
    end
  end
end
