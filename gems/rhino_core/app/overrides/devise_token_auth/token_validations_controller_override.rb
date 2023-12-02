# frozen_string_literal: true

# https://stackoverflow.com/questions/4470108/when-monkey-patching-an-instance-method-can-you-call-the-overridden-method-from/4471202
# Mixin Prepending
module DeviseTokenAuth::TokenValidationsController::Extensions
  def render_validate_token_error
    if DeviseTokenAuth.cookie_enabled
      # If a cookie is set with a domain specified then it must be deleted with that domain specified
      # See https://api.rubyonrails.org/classes/ActionDispatch/Cookies.html
      cookies.delete(DeviseTokenAuth.cookie_name, domain: DeviseTokenAuth.cookie_attributes[:domain])
    end
    super
  end
end

class DeviseTokenAuth::TokenValidationsController
  prepend DeviseTokenAuth::TokenValidationsController::Extensions
end
