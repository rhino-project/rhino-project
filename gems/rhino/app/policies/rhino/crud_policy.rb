# frozen_string_literal: true

module Rhino
  class CrudPolicy
    attr_reader :base_owner, :record

    def initialize(base_owner, record)
      @base_owner = base_owner
      @record = record
    end

    def action?(chain_command)
      # We must have a valid user and record to check
      return false unless base_owner && record

      # If this record is the base owner check for ownership
      return record.id == base_owner.id if record.class.base_owner?

      # Chain to the next owned record (until we find the base_owner)
      Pundit.policy(base_owner, record.owner).send(chain_command)
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
      return false unless base_owner

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
      attr_reader :base_owner, :scope

      def initialize(base_owner, scope)
        @base_owner = base_owner
        @scope = scope
      end

      def resolve
        # Must be logged in to see anything
        return scope.none unless base_owner

        # Join all the way to the base owner and see if it matches
        scope.joins(scope.joins_for_base_owner).where("#{Rhino.base_owner_class.table_name}.id": base_owner.id)
      end
    end
  end
end
