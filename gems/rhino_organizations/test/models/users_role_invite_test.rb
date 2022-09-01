# frozen_string_literal: true

require "test_helper"

class UsersRoleInviteTest < ActiveSupport::TestCase
  def setup
    @organization = create :organization
    @email = "test@test.com"
    @user = create :user, email: @email
    @role = create :role, name: "regular"
  end

  test "should track 'Invite Sent' when creating a UserRoleInvite" do
    mock = MiniTest::Mock.new
    mock.expect :call, nil
    users_role_invite = UsersRoleInvite.new(organization: @organization, role: @role, email: @email)

    users_role_invite.stub :track_invite, mock do
      users_role_invite.save!
    end

    mock.verify
  end
end
