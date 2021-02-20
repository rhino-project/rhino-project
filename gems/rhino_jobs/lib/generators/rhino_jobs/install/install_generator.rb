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
          "worker: QUEUE=* bundle exec rails resque:work\n"
        end
        inject_into_file 'Procfile' do
          "scheduler: bundle exec rails resque:scheduler\n"
        end
      end
    end
  end
end
