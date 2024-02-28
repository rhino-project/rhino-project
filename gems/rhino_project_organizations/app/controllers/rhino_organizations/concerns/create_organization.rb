# frozen_string_literal: true

module RhinoOrganizations
  module Concerns
    module CreateOrganization
      extend ActiveSupport::Concern

      def create_organization(resource)
        org_name = params.fetch(:organization, nil) || resource.name || resource.email
        org = Organization.create!(name: "#{org_name} Organization")
        UsersRole.create!(organization: org, user: resource, role: Role.find_or_create_by!(name: 'admin'))
      end
    end
  end
end
