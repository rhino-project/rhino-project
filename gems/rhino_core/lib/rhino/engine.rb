# frozen_string_literal: true

module Rhino
  class Engine < ::Rails::Engine
    config.autoload_paths << File.expand_path('../../lib', __dir__)
    config.autoload_paths << File.expand_path('../../app/resource', __dir__)
  end
end
