# frozen_string_literal: true

require_relative "../resource"
require_relative "active_model_extension/properties"
require_relative "active_model_extension/reference"
require_relative "active_model_extension/describe"
require_relative "active_model_extension/routing"
require_relative "active_model_extension/params"
require_relative "active_model_extension/serialization"
require_relative "active_model_extension/backing_store"

module Rhino
  module Resource
    module ActiveModelExtension
      extend ActiveSupport::Concern

      # The minimum needed to make this work
      include ActiveModel::Model
      include ActiveModel::Attributes
      include ActiveModel::Serializers::JSON

      # Base
      include Rhino::Resource

      # Active Model implementations
      include Rhino::Resource::ActiveModelExtension::Properties
      include Rhino::Resource::ActiveModelExtension::Reference
      include Rhino::Resource::ActiveModelExtension::Describe
      include Rhino::Resource::ActiveModelExtension::Routing
      include Rhino::Resource::ActiveModelExtension::Params
      include Rhino::Resource::ActiveModelExtension::Serialization

      included do
        rhino_controller :active_model_extension
      end
    end
  end
end
