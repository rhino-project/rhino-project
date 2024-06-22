# frozen_string_literal: true

require_relative '../resource'
require_relative 'active_record_extension/properties'
require_relative 'active_record_extension/reference'
require_relative 'active_record_extension/describe'
require_relative 'active_record_extension/routing'
require_relative 'active_record_extension/params'
require_relative 'active_record_extension/serialization'
require_relative 'active_record_extension/search'
require_relative 'active_record_extension/super_admin'

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
      include Rhino::Resource::ActiveRecordExtension::SuperAdmin
    end
  end
end
