# frozen_string_literal: true

class DeviseTokenAuth::PasswordsController
  # If there is an error preparing to edit the password, redirect to frontend
  # This would normally be an expired password token
  def render_edit_error
    redirect_to "#{ENV['FRONT_END_URL']}/auth/reset-password/expired"
  end
end
