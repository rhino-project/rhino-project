# frozen_string_literal: true

require "test_helper"
require "minitest/unit"
require "minitest/autorun"

class Rhino::UsersRoleTest < ActiveSupport::TestCase
  def setup
    @organization = create :organization
    @admin_role = create :role, name: "admin"
    @regular_role = create :role, name: "regular"
    @other_role = create :role, name: "other"
  end

  test "should allow updating role from an admin user_role when more than one admin in organization" do
    create :users_role, user: (create :user), organization: @organization, role: @admin_role
    admin_two = create :users_role, user: (create :user), organization: @organization, role: @admin_role

    admin_two.update!({ role: @regular_role })

    assert_equal @regular_role, admin_two.role
  end

  test "should allow updating role from a regular user_role when only one admin in organization" do
    create :users_role, user: (create :user), organization: @organization, role: @admin_role
    regular = create :users_role, user: (create :user), organization: @organization, role: @regular_role

    regular.update!({ role: @other_role })

    assert_equal @other_role, regular.role
  end

  test "should NOT allow updating role from an admin user_role when this admin is the only admin" do
    only_admin = create :users_role, user: (create :user), organization: @organization, role: @admin_role
    create :users_role, user: (create :user), organization: @organization, role: @regular_role

    exp = assert_raises ActiveRecord::RecordInvalid do
      only_admin.update!({ role: @regular_role })
    end

    assert_equal "Validation failed: Role Must have at least one user as admin", exp.message
    assert_equal "Must have at least one user as admin", only_admin.errors.first.type
  end

  test "should allow deleting an admin user_role when more than one admin in organization" do
    create :users_role, user: (create :user), organization: @organization, role: @admin_role
    admin_two = create :users_role, user: (create :user), organization: @organization, role: @admin_role

    admin_two.destroy!

    assert_equal 1, UsersRole.count
  end

  test "should allow deleting a regular user_role when only one admin in organization" do
    create :users_role, user: (create :user), organization: @organization, role: @admin_role
    regular = create :users_role, user: (create :user), organization: @organization, role: @regular_role

    regular.destroy!

    assert_equal 1, UsersRole.count
    assert_equal @admin_role, UsersRole.first.role
  end

  test "should NOT allow deleting an admin user_role when this admin is the only admin" do
    only_admin = create :users_role, user: (create :user), organization: @organization, role: @admin_role
    create :users_role, user: (create :user), organization: @organization, role: @regular_role

    exp = assert_raises ActiveRecord::RecordInvalid do
      only_admin.destroy!
    end

    assert_equal "Validation failed: Role Must have at least one user as admin", exp.message
    assert_equal "Must have at least one user as admin", only_admin.errors.first.type
  end

  test "should allow deleting an admin user_role when this admin is the only admin and the parent org is being destroyed" do
    only_admin = create :users_role, user: (create :user), organization: @organization, role: @admin_role

    # Destroy the only_admin should decrease roles and orgs by 1
    assert_difference ["UsersRole.count", "Organization.count"], -1 do
      only_admin.organization.destroy!
    end
  end
end

class SegmentTest < ActiveSupport::TestCase
  def setup
    @organization = create :organization
    @regular_role = create :role, name: "regular"
  end

  test "should track 'Account Added User' when adding a new role to user" do
    mock = MiniTest::Mock.new
    mock.expect :call, nil
    users_role = UsersRole.new(user: (create :user), organization: @organization, role: @regular_role)

    users_role.stub :track_account_added_user, mock do
      users_role.save!
    end

    mock.verify
  end

  test "should track 'Account Removed User' when deleting a user role" do
    mock = MiniTest::Mock.new
    mock.expect :call, nil
    users_role = create :users_role, user: (create :user), organization: @organization, role: @regular_role

    users_role.stub :track_account_removed_user, mock do
      users_role.destroy!
    end

    mock.verify
  end
end
