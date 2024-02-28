# frozen_string_literal: true

require 'rhino/engine'
require 'rhino_jobs/version'
module RhinoJobs
  class Engine < ::Rails::Engine
    config.autoload_paths << File.expand_path('../../lib', __dir__)

    initializer 'rhino_jobs.register_module' do
      config.after_initialize do
        if File.exist?(Rails.root.join('config/initializers/resque.rb'))
          Rhino.registered_modules[:rhino_jobs] = {
            version: RhinoJobs::VERSION::STRING
          }
        end
      end
    end
  end
end
