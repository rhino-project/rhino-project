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
    test "#{self.class} does not allow #{action_type} for unauthenticated user" do
      assert_not_permit nil, nil, action_type
    end
  end

  %i[create update destroy].each do |action_type|
    test "#{self.class} does not allow #{action_type} for authenticated user" do
      assert_not_permit @organization, @current_user, action_type
    end
  end

  %i[index show].each do |action_type|
    test "#{self.class} allows #{action_type} for authenticated user with admin role" do
      assert_permit @current_user, @organization, action_type
    end
  end

  # FIXME: index and show access handled by scoping; is this ok?
  %i[create update destroy].each do |action_type|
    test "#{self.class} does not allow #{action_type} for user in another organization with admin role" do
      assert_not_permit @another_user, @organization, action_type
    end
  end
end
