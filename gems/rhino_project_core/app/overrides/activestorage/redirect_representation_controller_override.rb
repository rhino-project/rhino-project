# frozen_string_literal: true

module ActiveStorage::Representations::RedirectController::Extensions
  def show
    authorize ActiveStorage::Attachment

    super
  end
end

class ActiveStorage::Representations::RedirectController
  include DeviseTokenAuth::Concerns::SetUserByToken
  include Pundit

  include Rhino::ErrorHandling
  include Rhino::Authenticated

  after_action :verify_authorized

  prepend ActiveStorage::Representations::RedirectController::Extensions
end
