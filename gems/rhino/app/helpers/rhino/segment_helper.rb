# frozen_string_literal: true

module Rhino
  module SegmentHelper
    module_function

    def track(type, user)
      segment_track(type, user)
    rescue StandardError => e
      Rollbar.error(e)
    end

    def track_account(type, organization, users_role = nil)
      segment_track_account(type, organization, users_role)
    rescue StandardError => e
      Rollbar.error(e)
    end

    def track_invite(users_role_invite)
      segment_track_invite(users_role_invite)
    rescue StandardError => e
      Rollbar.error(e)
    end

    def segment_track(type, user)
      Analytics.track(
        user_id: user.id,
        event: type,
        properties: {
          name: user.name,
          email: user.email,
          current_sign_in_ip: user.current_sign_in_ip,
          last_sign_in_ip: user.last_sign_in_ip,
          approved: user.approved
        }
      )
    end

    def segment_track_account(type, organization, users_role)
      properties = {}
      properties[:account_name] = organization.name
      properties[:user_email] = users_role.user&.email unless users_role.nil?
      properties[:role] = users_role.role&.name unless users_role.nil?
      Analytics.track(
        user_id: users_role.nil? ? organization.id : users_role.user&.id,
        event: type,
        properties:
      )
    end

    def segment_track_invite(users_role_invite)
      Analytics.track(
        event: "Invite Sent",
        user_id: Rhino::Current.user&.id,
        properties: {
          invitee_email: users_role_invite.email,
          invitee_role: users_role_invite.role&.name
        }
      )
    end
  end
end
