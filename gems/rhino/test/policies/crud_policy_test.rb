# frozen_string_literal: true

require "test_helper"
require "minitest/autorun"

class Rhino::CrudPolicyTest < Rhino::TestCase::Policy
  def setup
    @current_user = create :user
  end

  %i[index show update create destroy].each do |action_type|
    test "#{testing_policy} does not allow unauthenticated user to #{action_type}" do
      assert_not_permit nil, Dummy, action_type
    end
  end

  %i[index show update create destroy].each do |action_type| # rubocop:todo Style/CombinableLoops
    test "#{testing_policy} looks up role based policy and calls #{action_type}?" do
      @policy_class = Minitest::Mock.new
      @policy = Minitest::Mock.new
      @policy.expect "#{action_type}?", true
      @policy_class.expect :new, @policy, [Object, Object]

      Rhino::PolicyHelper.stub :find_policy, @policy_class do
        assert_permit @current_user, Dummy, action_type
      end

      @policy.verify
    end
  end

  # NUB-939
  %i[index show].each do |action_type|
    test "#{testing_policy} none scope does not crash #{action_type}?" do
      @policy_class = Minitest::Mock.new
      @policy = Minitest::Mock.new
      @policy.expect :resolve, Blog.none
      @policy_class.expect :new, @policy, [Object, Object]

      Rhino::PolicyHelper.stub :find_policy, @policy_class do
        assert_scope_empty @current_user, Blog
      end

      @policy.verify
    end
  end

  %i[show update create].each do |action_type|
    test "#{testing_policy} looks up role based policy and calls permitted_attributes_for_#{action_type}" do
      @policy_class = Minitest::Mock.new
      @policy = Minitest::Mock.new
      @policy.expect "permitted_attributes_for_#{action_type}", ["#{action_type}_param"]
      @policy_class.expect :new, @policy, [Object, Object]

      Rhino::PolicyHelper.stub :find_policy, @policy_class do
        assert_params @current_user, Dummy, action_type, ["#{action_type}_param"]
      end

      @policy.verify
    end
  end
end
