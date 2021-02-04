# frozen_string_literal: true

Overrides::RegistrationsController.class_eval do
  include RhinoOrganizations::Concerns::CreateOrganization

  def create
    super do |resource|
      create_organization(resource)
    end
  end
end
