# frozen_string_literal: true

require "test_helper"

class Rhino::AdminPolicyTest < Rhino::TestCase::Policy
  def setup
    @current_user = create :user
  end

  %i[index show create update destroy].each do |action_type|
    test "#{testing_policy} does not allow #{action_type} for unauthenticated user" do
      assert_not_permit nil, Dummy, action_type
    end
  end

  # Current user
  %i[index show create update destroy].each do |action_type| # rubocop:todo Style/CombinableLoops
    test "#{testing_policy} allows #{action_type} for authenticated user" do
      assert_permit @current_user, Dummy, action_type
    end
  end
end
