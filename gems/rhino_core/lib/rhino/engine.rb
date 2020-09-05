# frozen_string_literal: true

module Rhino
  class Engine < ::Rails::Engine
    config.autoload_paths << File.expand_path('../../lib', __dir__)
    config.autoload_paths << File.expand_path('../../app/resources', __dir__)

    ActiveSupport.on_load(:active_record) do
      include Rhino::Resource::ActiveRecord if Rhino.auto_include_active_record
    end

    ActiveSupport.on_load(:active_storage_attachment) do
      include Rhino::Resource::ActiveStorage
    end
  end
end
