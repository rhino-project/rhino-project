# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveRecord
      extend ActiveSupport::Concern

      # Base
      include Rhino::Resource

      # Active Record implementations
      include Rhino::Resource::ActiveRecord::Attributes
      include Rhino::Resource::ActiveRecord::Included
      include Rhino::Resource::ActiveRecord::Reference
      include Rhino::Resource::ActiveRecord::Describe
      include Rhino::Resource::ActiveRecord::Routing
    end
  end
end
