# frozen_string_literal: true

module Rhino
  module Resource
    module Owner
      extend ActiveSupport::Concern

      included do
        class_attribute :owned_by, default: nil

        delegate :auth_owner?, :base_owner?, :global_owner?, to: :class
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

        # Test if rhino_owner[rdoc-ref:rhino_owner] is the base owner
        # Also available on the instance
        def global_owner?
          self.owned_by == :global
        end

        # Test if rhino_owner[rdoc-ref:rhino_owner] is the base owner
        # Also available on the instance
        def global_owned?
          chained_scope = self
          while !chained_scope.auth_owner? && !chained_scope.base_owner? && !chained_scope.global_owner?
            chained_scope = chained_scope.owned_by.to_s.classify.safe_constantize
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
          self.owned_by = name
          rhino_policy :global if global_owned?
        end

        # Sets rhino_owner[rdoc-ref:rhino_owner] to be the base owner
        def rhino_owner_base(**options)
          rhino_owner(Rhino.base_owner.model_name.i18n_key, options)
        end

        # Sets rhino_owner[rdoc-ref:rhino_owner] to be global
        def rhino_owner_global(**options)
          rhino_owner(:global, options)
        end
      end
      # rubocop:enable Style/RedundantSelf
    end
  end
end
