# frozen_string_literal: true

Overrides::RegistrationsController.class_eval do
  def create
    super do |resource|
      org_name = params.fetch(:organization) || resource.name || resource.email
      org = Organization.create!(name: "#{org_name} Organization")
      UsersRole.create!(organization: org, user: resource, role: Role.find_or_create_by!(name: 'admin'))
    end
  end
end
