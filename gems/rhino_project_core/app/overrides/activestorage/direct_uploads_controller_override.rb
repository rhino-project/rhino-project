# frozen_string_literal: true

# https://stackoverflow.com/questions/4470108/when-monkey-patching-an-instance-method-can-you-call-the-overridden-method-from/4471202
# Mixin Prepending
module ActiveStorage::DirectUploadsController::Extensions
  def create
    authorize ActiveStorage::Attachment

    super
  end
end

class ActiveStorage::DirectUploadsController
  include DeviseTokenAuth::Concerns::SetUserByToken
  include Pundit

  include Rhino::ErrorHandling
  include Rhino::Authenticated

  after_action :verify_authorized

  prepend ActiveStorage::DirectUploadsController::Extensions
end
