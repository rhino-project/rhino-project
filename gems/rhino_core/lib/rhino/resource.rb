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

      # FIXME: do we want to create a scope using this?
      # FIXME: how to handle nil/globally owned
      def joins_for_auth_owner # rubocop:disable Metrics/AbcSize
        return {} if auth_owner?

        # Find the reflection to the auth owner
        return Rhino.base_to_auth if base_owner?

        # FIXME: There is probably a more rubyish way to do this
        chained_scope = self
        joins = []

        # The ownership could be a many, so we classify first
        while chained_scope.owned_by.to_s.classify != Rhino.base_owner.to_s.classify
          joins << chained_scope.owned_by
          chained_scope = chained_scope.owned_by.to_s.classify.constantize
        end
        joins << chained_scope.owned_by

        joins = joins.reverse
        # Only chain extra to auth if its not the same
        joins = joins.inject(Rhino.same_owner? ? {} : Rhino.base_to_auth) { |a, n| { n => a } }

        joins
      end
    end
  end
end
