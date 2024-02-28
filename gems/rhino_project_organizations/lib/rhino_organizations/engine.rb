# frozen_string_literal: true

require 'rhino/engine'
require 'rhino_organizations/version'

module RhinoOrganizations
  class Engine < ::Rails::Engine
    config.autoload_paths << File.expand_path('../../lib', __dir__)

    initializer 'rhino_organizations.register_module' do
      config.after_initialize do
        if Rhino.resources.include?('Organization')
          Rhino.registered_modules[:rhino_organizations] = {
            version: RhinoOrganizations::VERSION::STRING
          }
        end
      end
    end

    # https://guides.rubyonrails.org/engines.html#overriding-models-and-controllers
    # Use root instead of Rails.root to scope for this engine
    initializer 'rhino_organizations.overrides' do
      overrides = "#{root}/app/overrides"
      Rails.autoloaders.main.ignore(overrides)

      config.to_prepare do
        # FIXME: Only necessary because this module is in tree NUB-682
        if Rhino.resources.include?('Organization')
          Dir.glob("#{overrides}/**/*_override.rb").each do |override|
            load override
          end
        end
      end
    end
  end
end
