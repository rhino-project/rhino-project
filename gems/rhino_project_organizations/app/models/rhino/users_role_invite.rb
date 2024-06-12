# frozen_string_literal: true

module Rhino
  class UsersRoleInvite < ApplicationRecord
    self.abstract_class = true

    rhino_policy :users_role
    # FIXME: Only necessary because this module is in tree NUB-910
    rhino_owner :organization if Rhino.resources.include?("Organization")
    rhino_references %i[role organization]
    rhino_controller :users_role_invite

    before_save :normalize_email

    after_create do
      ::UsersRole.create!(user: ::User.find_by(email:), organization:, role:)
    end

    after_create_commit :track_invite

    private
      def track_invite
        Rhino::SegmentHelper.track_invite(self)
      end

      def normalize_email
        self.email = email.downcase
      end
  end
end
