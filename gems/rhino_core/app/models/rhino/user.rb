# frozen_string_literal: true

module Rhino
  class User < ApplicationRecord
    self.abstract_class = true

    include DeviseTokenAuth::Concerns::User

    rhino_properties_read only: %i[id name nickname email image]
    rhino_properties_create only: %i[name nickname email]
    rhino_properties_update only: %i[name nickname]

    rhino_policy :user

    def self.devise_modules_to_load
      modules = %i[database_authenticatable registerable recoverable rememberable trackable validatable confirmable omniauthable]
      modules.push :invitable if Rhino.resources.include?("Organization")
    end
    devise(*devise_modules_to_load)

    validates :email, uniqueness: { case_sensitive: false }
    after_create_commit :track_sign_up

    def display_name
      name || email
    end

    def self.roles_for_auth(auth_owner, record = nil)
      return {} unless auth_owner

      # If user is logged in, but no record, they are still an admin for their data
      # Otherwise owner must match to be an admin
      # A list of roles as hash keys with an array of base_owners for each
      return { admin: [auth_owner] } if !record.respond_to?(:base_owner_ids) || record.base_owner_ids.include?(auth_owner&.id)

      {}
    end

    private
      def track_sign_up
        Rhino::SegmentHelper.track("Signed Up", self)
      end
  end
end
