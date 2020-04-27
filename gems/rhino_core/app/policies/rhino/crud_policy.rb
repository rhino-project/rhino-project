# frozen_string_literal: true

module Rhino
  class CrudPolicy
    attr_reader :auth_owner, :record

    def initialize(auth_owner, record)
      @auth_owner = auth_owner
      @record = record
    end

    def action?(chain_command) # rubocop:disable  Metrics/AbcSize, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
      # We must have a valid user and record to check
      return false unless auth_owner && record

      # If this record is the base owner check for ownership
      # This check works like global_owner? on many relationships
      if record.base_owner?
        # If both auth owner and the base owner are the same (ie user)
        # Just check the ids
        return auth_owner.id == record.id if Rhino.same_owner?

        # Get list of users ids from base_owner
        ids = if record.is_a? ActiveRecord::Associations::CollectionProxy
                record.map { |o| o.send(Rhino.base_to_auth).pluck(:id) }.flatten
              else
                record.send(Rhino.base_to_auth).map(&:id)
              end

        return ids.include?(auth_owner.id)
      end

      return record.id == auth_owner.id if record.auth_owner?

      # Chain to the next owned record (until we find the base_owner)
      Pundit.policy(auth_owner, record.owner).send(chain_command)
    end

    ###
    # Create
    ###
    def create?
      # :update? is on purpose - if we chain to the parent for permission we are
      # updating the parent
      action?(:update?)
    end

    def permitted_attributes_for_create
      record.create_params
    end

    ###
    # Index
    ###
    def index?
      return false unless auth_owner

      true
    end

    ###
    # Show
    ###
    def show?
      action?(:show?)
    end

    def permitted_attributes_for_show
      record.show_params
    end

    ###
    # Update
    ###
    def update?
      action?(:update?)
    end

    def permitted_attributes_for_update
      record.update_params
    end

    ###
    # Destroy
    ###
    def destroy?
      action?(:destroy?)
    end

    class Scope
      attr_reader :auth_owner, :scope

      def initialize(auth_owner, scope)
        @auth_owner = auth_owner
        @scope = scope
      end

      def resolve
        # Must be logged in to see anything
        return scope.none unless auth_owner

        # Join all the way to the auth owner
        base_owner_scope = scope.joins(scope.joins_for_auth_owner)

        # Check to see if the auth owner ids match up
        base_owner_scope.where("#{Rhino.auth_owner.table_name}.id": auth_owner.id)
      end
    end
  end
end
