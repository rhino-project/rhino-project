# frozen_string_literal: true

require 'rhino/engine'

module RhinoJobs
  class Engine < ::Rails::Engine
    config.autoload_paths << File.expand_path('../../lib', __dir__)

    initializer 'rhino_jobs.register_module' do
      config.after_initialize do
        if File.exist?(Rails.root.join('config/initializers/resque.rb'))
          Rhino.registered_modules[:rhino_jobs] = {
            version: RhinoJobs::VERSION
          }
        end
      end
    end
  end
end
