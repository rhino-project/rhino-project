# frozen_string_literal: true

# https://stackoverflow.com/questions/4470108/when-monkey-patching-an-instance-method-can-you-call-the-overridden-method-from/4471202
# Mixin Prepending
module DeviseTokenAuth::RegistrationsController::Extensions
  include RhinoOrganizations::Concerns::CreateOrganization

  def create
    return render_error(401, "signup is not allowed") unless Rhino.allow_signup

    super do |resource|
      # Create if this is the first time we've seen the user
      create_organization(resource) if Rhino.resources.include?("Organization")
    end
  end
end

class DeviseTokenAuth::RegistrationsController
  prepend DeviseTokenAuth::RegistrationsController::Extensions
end
