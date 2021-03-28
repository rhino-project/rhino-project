# frozen_string_literal: true

require_relative 'resource/owner'
require_relative 'resource/properties'
require_relative 'resource/reference'
require_relative 'resource/describe'
require_relative 'resource/routing'
require_relative 'resource/params'
require_relative 'resource/serialization'
require_relative 'resource/sieves'

require_relative '../../app/policies/rhino/crud_policy'

module Rhino
  module Resource
    extend ActiveSupport::Concern

    include Rhino::Resource::Owner
    include Rhino::Resource::Properties
    include Rhino::Resource::Reference
    include Rhino::Resource::Describe
    include Rhino::Resource::Routing
    include Rhino::Resource::Params
    include Rhino::Resource::Serialization
    include Rhino::Resource::Sieves

    included do
      class_attribute :_policy_class, default: Rhino::CrudPolicy

      def owner
        send self.class.resource_owned_by
      end

      def display_name
        return name if respond_to? :name
        return title if respond_to? :title

        nil
      end
    end

    class_methods do
      def policy_class
        _policy_class
      end

      def rhino_policy(policy)
        self._policy_class = "rhino/#{policy}_policy".classify.constantize
      end
    end
  end
end
