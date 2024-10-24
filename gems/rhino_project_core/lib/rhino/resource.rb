# frozen_string_literal: true

require_relative "resource/owner"
require_relative "resource/properties"
require_relative "resource/reference"
require_relative "resource/describe"
require_relative "resource/routing"
require_relative "resource/params"
require_relative "resource/serialization"
require_relative "resource/sieves"

require_relative "../../app/policies/rhino/crud_policy"

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
      class_attribute :_policy_class

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
        self._policy_class ||= begin
          return Rhino::GlobalPolicy if global_owned?

          Rhino::CrudPolicy
        end
      end

      def rhino_policy(policy)
        # Look for local policy first, then look in the rhino namespace
        self._policy_class = "#{policy}_policy".classify.safe_constantize || "rhino/#{policy}_policy".classify.safe_constantize

        raise "Policy #{policy} not found for #{name}" unless _policy_class
      end
    end
  end
end
