# frozen_string_literal: true

module Overrides
  class PasswordsController < DeviseTokenAuth::PasswordsController
    def render_edit_error
      redirect_to ENV['FRONT_END_URL'] + '/reset-password/expired'
    end
  end
end
