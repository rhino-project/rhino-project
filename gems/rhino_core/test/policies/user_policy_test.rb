# frozen_string_literal: true

require "test_helper"

class Rhino::UserPolicyTest < Rhino::TestCase::Policy
  def setup
    @current_user = create :user
    @another_user = create :user
  end

  %i[index show create update destroy].each do |action_type|
    test "#{testing_policy} does not allow #{action_type} for unauthenticated user" do
      assert_not_permit nil, @current_user, action_type
    end
  end

  # Current user
  %i[create destroy].each do |action_type|
    test "#{testing_policy} does not allow #{action_type} for authenticated user" do
      assert_not_permit @current_user, @current_user, action_type
    end
  end

  %i[update].each do |action_type|
    test "#{testing_policy} allows #{action_type} for authenticated user" do
      assert_permit @current_user, @current_user, action_type
    end
  end

  %i[index show].each do |action_type|
    test "#{testing_policy} allows #{action_type} for authenticated user and returns correct user" do
      assert_permit @current_user, @current_user, action_type
      assert_scope_only @current_user, User, [@current_user]
    end
  end

  # Another user
  %i[update].each do |action_type|
    test "#{testing_policy} does not allow #{action_type} for another user" do
      assert_not_permit @current_user, @another_user, action_type
    end
  end

  ##
  # Failure/edge cases
  ##
  %i[update].each do |action_type| # rubocop:todo Style/CombinableLoops
    test "#{testing_policy} does not allow #{action_type} for nil user" do
      assert_not_permit nil, @current_user, action_type
    end

    test "#{testing_policy} does not allow #{action_type} for nil record" do
      assert_not_permit @current_user, nil, action_type
    end
  end

  test "#{testing_policy} returns no scope for nil user" do
    assert_scope_empty nil, User
  end
end
