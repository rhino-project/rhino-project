# frozen_string_literal: true

require_relative "../resource"
require_relative "active_model_extension/properties"
require_relative "active_model_extension/reference"
require_relative "active_model_extension/describe"
require_relative "active_model_extension/routing"
require_relative "active_model_extension/params"
require_relative "active_model_extension/serialization"

module Rhino
  module Resource
    module ActiveModelExtension
      extend ActiveSupport::Concern

      # Base
      include Rhino::Resource

      # Active Record implementations
      include Rhino::Resource::ActiveModelExtension::Properties
      include Rhino::Resource::ActiveModelExtension::Reference
      include Rhino::Resource::ActiveModelExtension::Describe
      include Rhino::Resource::ActiveModelExtension::Routing
      include Rhino::Resource::ActiveModelExtension::Params
      include Rhino::Resource::ActiveModelExtension::Serialization
    end
  end
end
