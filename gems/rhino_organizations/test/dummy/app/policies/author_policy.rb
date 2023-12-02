# frozen_string_literal: true

class AuthorPolicy < ::Rhino::ViewerPolicy
  def check_author
    return false unless auth_owner

    record.class.where(id: record.id).joins(record.joins_for(:blog)).exists?("blogs.user_id": auth_owner.id)
  end

  # Can always create (for themselves)
  def create?
    authorize_action(true)
  end

  def update?
    authorize_action(check_author)
  end

  def destroy?
    authorize_action(check_author)
  end

  class Scope < ::Rhino::ViewerPolicy::Scope
    # def resolve
    #   return scope if scope.base_owner? || scope.auth_owner?
    #
    #   # FIXME: user_id because haven't properly renamed to 'author'
    #   scope.joins(scope.joins_for_base_owner).where('blogs.user_id': auth_owner.id)
    # end
  end
end
