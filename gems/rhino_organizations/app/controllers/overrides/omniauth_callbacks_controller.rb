# frozen_string_literal: true

Overrides::OmniauthCallbacksController.class_eval do
  include RhinoOrganizations::Concerns::CreateOrganization

  def omniauth_success
    super do |resource|
      create_organization(resource)
    end
  end
end
