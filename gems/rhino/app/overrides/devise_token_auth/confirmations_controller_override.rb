# frozen_string_literal: true

class DeviseTokenAuth::ConfirmationsController
  # devise_token_auth raises an error if the confirmation token can't be found
  def show
    super
  rescue StandardError
    redirect_to ENV["FRONT_END_URL"]
  end
end
