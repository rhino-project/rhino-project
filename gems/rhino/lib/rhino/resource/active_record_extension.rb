# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveRecordExtension
      extend ActiveSupport::Concern

      # Base
      include Rhino::Resource

      # Active Record implementations
      include Rhino::Resource::ActiveRecordExtension::Properties
      include Rhino::Resource::ActiveRecordExtension::Reference
      include Rhino::Resource::ActiveRecordExtension::Describe
      include Rhino::Resource::ActiveRecordExtension::Routing
      include Rhino::Resource::ActiveRecordExtension::Params
      include Rhino::Resource::ActiveRecordExtension::Serialization
      include Rhino::Resource::ActiveRecordExtension::Search
    end
  end
end
