# frozen_string_literal: true

module Rhino
  module Resource
    module Owner
      extend ActiveSupport::Concern

      included do
        class_attribute :resource_owned_by, default: nil

        delegate :auth_owner?, :base_owner?, :global_owner?, to: :class
        delegate :joins_for, :joins_for_auth_owner, :joins_for_base_owner, to: :class
      end

      def base_owner_ids
        owner_ids(:joins_for_base_owner)
      end

      def auth_owner_ids
        owner_ids(:joins_for_auth_owner)
      end

      # The self is actually required to work with class_attribute properly
      # rubocop:disable Style/RedundantSelf
      class_methods do # rubocop:disable  Metrics/BlockLength
        # Test if rhino_owner[rdoc-ref:rhino_owner] is the auth owner
        # Also available on the instance
        def auth_owner?
          self == Rhino.auth_owner
        end

        # Test if rhino_owner[rdoc-ref:rhino_owner] is the base owner
        # Also available on the instance
        def base_owner?
          self == Rhino.base_owner
        end

        # Test if rhino_owner[rdoc-ref:rhino_owner] is the global owner
        # Also available on the instance
        def global_owner?
          self.resource_owned_by == :global
        end

        # Test if rhino_owner[rdoc-ref:rhino_owner] is globally owned at the top of the hierarchy
        # Also available on the instance
        def global_owned?
          chained_scope = self
          while !chained_scope.auth_owner? && !chained_scope.base_owner? && !chained_scope.global_owner?
            chained_scope = chained_scope.resource_owned_by.to_s.classify.safe_constantize
          end

          chained_scope.global_owner?
        end

        # In Rhino the owner specifies which reference is next in the hierarchy.
        # A resource can only have one owned.  This owner will either be global
        # for resources that are not owned by the base owner or a belongs to
        # reference that will eventually lead to the base owner.  The resource
        # must respond to send(:owner_name) on the instance unless it is global.
        # Such as:
        #
        #   rhino_owner :user
        #
        # Will indicate the resource has a has_one reference to user
        #
        # === Examples
        #
        #   # Blog is owned by user
        #   class Blog < ApplicationRecord
        #     include Rhino::Resource::ActiveRecord
        #
        #     rhino_owner :user
        #   end
        #
        #   # BlogPost is owned by Blog
        #   class Blog < ApplicationRecord
        #     include Rhino::Resource::ActiveRecord
        #
        #     rhino_owner :blog
        #   end
        #
        #   # Category is global
        #   class Category < ApplicationRecord
        #     include Rhino::Resource::ActiveRecord
        #
        #     # Can also use rhino_owner_global as a short cut
        #     rhino_owner :global
        #   end
        #
        def rhino_owner(name, **_options)
          self.resource_owned_by = name
        end

        # Sets rhino_owner[rdoc-ref:rhino_owner] to be the base owner
        def rhino_owner_base(...)
          rhino_owner(Rhino.base_owner.model_name.i18n_key, ...)
        end

        # Sets rhino_owner[rdoc-ref:rhino_owner] to be global
        def rhino_owner_global(...)
          rhino_owner(:global, ...)
        end

        def joins_for_auth_owner
          return {} if auth_owner?

          # Find the reflection to the auth owner
          return Rhino.base_to_auth if base_owner?

          joins = simple_joins_for_base_owner

          # Only chain extra to auth if its not the same
          joins.inject(Rhino.same_owner? ? {} : Rhino.base_to_auth) { |a, n| { n => a } }
        end

        def joins_for_base_owner
          return {} if base_owner?

          return Rhino.auth_to_base if auth_owner?

          joins = simple_joins_for_base_owner

          joins.inject({}) { |a, n| { n => a } }
        end

        def joins_for(parent)
          return {} if parent.to_s.classify == self.to_s.classify

          joins = simple_joins_for(parent)

          joins.inject({}) { |a, n| { n => a } }
        end

        private
          def simple_joins_for(parent)
            # FIXME: There is probably a more rubyish way to do this
            chained_scope = self
            joins = []

            # The ownership could be a many, so we classify first
            while chained_scope.resource_owned_by.to_s.classify != parent.to_s.classify
              joins << chained_scope.resource_owned_by
              chained_scope = chained_scope.resource_owned_by.to_s.classify.constantize
            end
            joins << chained_scope.resource_owned_by

            joins.reverse
          end

          def simple_joins_for_base_owner
            simple_joins_for(Rhino.base_owner)
          end
      end
      # rubocop:enable Style/RedundantSelf
    end

    private
      # We use the parent as the starting point because if the record is not
      # persisted yet, we won't be able to find it
      def owner_ids(joins)
        bo = Rhino.base_owner

        return [] unless owner

        parent_klass = owner.class
        pk = parent_klass.primary_key

        parent_klass.joins(parent_klass.send(joins)).where("#{pk}": owner[pk]).pluck("#{bo.table_name}.#{bo.primary_key}")
      end
  end
end
