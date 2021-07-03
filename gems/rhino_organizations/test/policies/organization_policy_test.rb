# frozen_string_literal: true

require "test_helper"

class Rhino::OrganizationPolicyTest < Rhino::TestCase::Policy
  def setup
    @organization = create :organization
    @admin_role = create :role
    @current_user = create :user

    create :users_role, user: @current_user, organization: @organization, role: @admin_role

    @another_user = create :user
    @another_organization = create :organization
    create :users_role, user: @another_user, organization: @another_organization, role: @admin_role
  end

  %i[index show create update destroy].each do |action_type|
    test "#{testing_policy} does not allow #{action_type} for unauthenticated user" do
      assert_not_permit nil, @organization, action_type
    end
  end

  # Current user
  %i[create destroy].each do |action_type|
    test "#{testing_policy} does not allow #{action_type} for authenticated user" do
      assert_not_permit @current_user, @organization, action_type
    end
  end

  %i[index show].each do |action_type|
    test "#{testing_policy} allows #{action_type} for authenticated user with admin role and returns correct organization" do
      assert_permit @current_user, @organization, action_type
      assert_scope_only @current_user, Organization, [@organization]
    end
  end

  %i[update].each do |action_type|
    test "#{testing_policy} allows #{action_type} for authenticated admin user" do
      assert_permit @current_user, @organization, action_type
    end
  end

  # Another user
  %i[create update destroy].each do |action_type|
    test "#{testing_policy} does not allow #{action_type} for user in another organization with admin role" do
      assert_not_permit @another_user, @organization, action_type
    end
  end

  %i[index show].each do |action_type|
    test "#{testing_policy} allows #{action_type} for authenticated user in another organization with admin role and returns correct organization" do
      assert_permit @another_user, @organization, action_type
      assert_scope_only @another_user, Organization, [@another_organization]
    end
  end
end
