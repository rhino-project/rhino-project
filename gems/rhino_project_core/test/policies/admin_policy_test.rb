# frozen_string_literal: true

require "test_helper"

class Rhino::AdminPolicyTest < Rhino::TestCase::Policy
  def setup
    @current_user = create :user
  end

  # Current user
  %i[index show create update destroy].each do |action_type|
    test "#{testing_policy} allows #{action_type} for authenticated user" do
      assert_permit @current_user, Dummy, action_type
    end
  end
end
