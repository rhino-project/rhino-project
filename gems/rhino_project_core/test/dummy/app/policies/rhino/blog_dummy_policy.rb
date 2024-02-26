# frozen_string_literal: true

# Base policy allows no actions by default
# Permitted attributes are the default not empty set though
module Rhino
  class BlogDummyPolicy < CrudPolicy
    def index?
      true
    end

    def show?
      true
    end

    def create?
      true
    end

    def update?
      true
    end

    def destroy?
      true
    end

    def permitted_attributes_for_create
      %i[name blog_id]
    end

    def permitted_attributes_for_show
      %i[name blog_id]
    end

    class Scope
      attr_reader :auth_owner, :scope

      def initialize(auth_owner, scope)
        @auth_owner = auth_owner
        @scope = scope
      end

      def resolve
        scope.all
      end
    end
  end
end
