# frozen_string_literal: true

require "test_helper"

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
end
