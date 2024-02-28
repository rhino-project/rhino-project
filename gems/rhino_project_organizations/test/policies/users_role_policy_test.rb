# frozen_string_literal: true

require "test_helper"

class Rhino::UsersRolePolicyTest < Rhino::TestCase::Policy
  def setup
    @organization = create :organization
    @another_organization = create :organization

    @regular_role = create :role, name: "regular"

    @regular_user = create :user
    @another_regular_user = create :user

    @org_regular_user = create :users_role, user: @regular_user, organization: @organization, role: @regular_role
    @org_another_regular_user = create :users_role, user: @another_regular_user, organization: @organization, role: @regular_role

    @another_org_regular_user = create :users_role, user: @regular_user, organization: @another_organization, role: @regular_role
  end
end

class Rhino::RegularUserUsersRolePolicy < Rhino::UsersRolePolicyTest
  %i[create].each do |action_type|
    test "#{testing_policy} does not allow #{action_type} for users with regular role" do
      form = build(:users_role, organization: @organization, user: @regular_user, role: @regular_role)
      assert_not_permit @regular_user, form, action_type
    end
  end

  %i[update destroy].each do |action_type|
    test "#{testing_policy} does not allow #{action_type} for users with regular role for their own users_roles records" do
      assert_not_permit @regular_user, @org_regular_user, action_type
    end
  end

  %i[index].each do |action_type|
    test "#{testing_policy} allows #{action_type} for users with regular role" do
      assert_permit @regular_user, @org_regular_user, action_type
    end

    test "#{testing_policy} #{action_type} returns only users_roles owned by user, across all organizations" do
      assert_scope_only @regular_user, UsersRole, [@org_regular_user, @another_org_regular_user]
    end
  end

  %i[show].each do |action_type|
    test "#{testing_policy} allows #{action_type} for users with regular role for their own users_roles records" do
      assert_permit @regular_user, @org_regular_user, action_type
    end

    test "#{testing_policy} does not allow #{action_type} for users with regular role for other users' users_roles records" do
      assert_not_permit @regular_user, @org_another_regular_user, action_type
    end
  end
end

class Rhino::AdminUserUsersRolePolicy < Rhino::UsersRolePolicyTest
  def setup
    super
    @admin_role = create :role, name: "admin"

    @admin_user = create :user
    @another_admin_user = create :user

    @org_admin_user = create :users_role, user: @admin_user, organization: @organization, role: @admin_role
    @org_another_admin_user = create :users_role, user: @another_admin_user, organization: @organization, role: @admin_role
    @another_org_admin_user = create :users_role, user: @admin_user, organization: @another_organization, role: @admin_role
  end

  %i[create].each do |action_type|
    test "#{testing_policy} allows #{action_type} for users with admin role to an organization in which user is admin" do
      form = build(:users_role, organization: @organization)
      assert_permit @admin_user, form, action_type
    end

    test "#{testing_policy} does not allow #{action_type} for users with admin role to an organization in which user is NOT admin" do
      form = build(:users_role, organization: create(:organization))
      assert_not_permit @admin_user, form, action_type
    end
  end

  %i[index].each do |action_type|
    test "#{testing_policy} allows #{action_type} for users with admin role" do
      assert_permit @admin_user, @org_admin_user, action_type
    end

    test "#{testing_policy} #{action_type} returns all users_roles, across all organizations on which user has admin role" do
      assert_scope_only @admin_user, UsersRole, [
        @org_regular_user,
        @org_another_regular_user,
        @org_admin_user,
        @org_another_admin_user,
        @another_org_regular_user,
        @another_org_admin_user
      ]
    end
  end

  %i[show update destroy].each do |action_type|
    test "#{testing_policy} allows #{action_type} for users with admin role for their own users_roles records" do
      assert_permit @admin_user, @org_admin_user, action_type
    end

    test "#{testing_policy} allows #{action_type} for other users' users_roles records in organizations in which user is admin" do
      assert_permit @admin_user, @org_regular_user, action_type
      assert_permit @admin_user, @org_admin_user, action_type
      assert_permit @admin_user, @org_another_admin_user, action_type
    end
  end
end
