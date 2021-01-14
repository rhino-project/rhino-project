# frozen_string_literal: true

require 'rhino/engine'

module RhinoOrganizations
  class Engine < ::Rails::Engine
    config.autoload_paths << File.expand_path('../../lib', __dir__)

    initializer 'rhino_organizations.register_module' do
      config.after_initialize do
        if Rhino.resources.include?('Organization')
          Rhino.registered_modules[:rhino_organizations] = {
            version: RhinoOrganizations::VERSION
          }
        end
      end
    end

    initializer 'rhino_organizations.overrides' do
      Rails.autoloaders.main.ignore("#{paths.path}/app/controllers/overrides")

      config.after_initialize do
        if Rhino.resources.include?('Organization')
          overrides = "#{paths.path}/app/controllers/overrides"
          Dir.glob("#{overrides}/**/*.rb").each do |override|
            load override
          end
        end
      end
    end
  end
end
