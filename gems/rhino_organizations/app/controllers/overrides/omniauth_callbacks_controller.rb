# frozen_string_literal: true

Overrides::OmniauthCallbacksController.class_eval do
  include RhinoOrganizations::Concerns::CreateOrganization

  def omniauth_success
    super do |resource|
      # Create if this is the first time we've seen the user
      create_organization(resource) if @oauth_registration
    end
  end
end
