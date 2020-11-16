# frozen_string_literal: true

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
        send self.class.owned_by
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
