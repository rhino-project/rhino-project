# frozen_string_literal: true

# https://stackoverflow.com/questions/4470108/when-monkey-patching-an-instance-method-can-you-call-the-overridden-method-from/4471202
# Mixin Prepending
module DeviseTokenAuth::OmniauthCallbacksController::Extensions
  include RhinoOrganizations::Concerns::CreateOrganization

  def omniauth_success
    super do |resource|
      if Rhino.resources.include?("Organization") && @oauth_registration
        # Create if this is the first time we've seen the user
        create_organization(resource)
      end
    end

    # set a server cookie if configured
    if DeviseTokenAuth.cookie_enabled
      auth_header = @resource.build_auth_header(@token.token, @token.client)
      cookies[DeviseTokenAuth.cookie_name] = DeviseTokenAuth.cookie_attributes.merge(value: auth_header.to_json)
    end
  rescue ActiveRecord::RecordInvalid
    # Technically this could be something else, but this is the most common
    # devise_token_auth calls save! which is why we catch it here
    render_data_or_redirect("authFailure", error: "Email address in use")
  end
end

class DeviseTokenAuth::OmniauthCallbacksController
  prepend DeviseTokenAuth::OmniauthCallbacksController::Extensions
end
