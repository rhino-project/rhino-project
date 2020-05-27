# frozen_string_literal: true

module Rhino
  class GlobalPolicy
    attr_reader :base_owner, :record

    def initialize(base_owner, record)
      @base_owner = base_owner
      @record = record
    end

    ###
    # Create
    ###
    def create?
      false
    end

    def permitted_attributes_for_create
      []
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
      return false unless base_owner

      true
    end

    def permitted_attributes_for_show
      record.show_params
    end

    ###
    # Update
    ###
    def update?
      false
    end

    def permitted_attributes_for_update
      []
    end

    ###
    # Destroy
    ###
    def destroy?
      false
    end

    class Scope
      attr_reader :base_owner, :scope

      def initialize(base_owner, scope)
        @base_owner = base_owner
        @scope = scope
      end

      def resolve
        scope.all
      end
    end
  end
end
