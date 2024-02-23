# frozen_string_literal: true

class StripePolicy < Rhino::BasePolicy
  def create_checkout_session?
    authorize_action(admin?)
  end

  private
    def admin?
      Rhino.base_owner.roles_for_auth(auth_owner).any? { |k, _| k.to_s == "admin" }
    end
end
