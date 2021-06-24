# frozen_string_literal: true

module DeviseTokenAuth::SessionsController::Extensions
  def render_destroy_error
    if DeviseTokenAuth.cookie_enabled
      # If a cookie is set with a domain specified then it must be deleted with that domain specified
      # See https://api.rubyonrails.org/classes/ActionDispatch/Cookies.html
      cookies.delete(DeviseTokenAuth.cookie_name, domain: DeviseTokenAuth.cookie_attributes[:domain])
    end
    super
  end
end

class DeviseTokenAuth::SessionsController
  prepend DeviseTokenAuth::SessionsController::Extensions
end
