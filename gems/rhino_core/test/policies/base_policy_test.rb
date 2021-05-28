# frozen_string_literal: true

require "test_helper"

class Rhino::BasePolicyTest < Rhino::TestCase::Policy
  def setup
    @current_user = create :user
    @another_user = create :user
  end

  class Rhino::BasePolicyTest::DummyModelPermittedParams < ApplicationRecord
    self.table_name = "dummies"

    attribute :create_attr, :string
    attribute :update_attr, :string
    attribute :show_attr, :string

    rhino_properties_read only: %i[show_attr]
    rhino_properties_create only: %i[create_attr]
    rhino_properties_update only: %i[update_attr]
  end

  ##
  # Custom actions and their permitted params
  ##
  test "#{testing_policy} extracts custom action name for permitted params" do
    assert_equal "customaction", policy_instance(@current_user, Dummy).permitted_method("permitted_attributes_for_customaction")
  end

  test "#{testing_policy} does not crash extracting custom action name for permitted params" do
    assert_nil policy_instance(@current_user, Dummy).permitted_method("garbage")
  end

  test "#{testing_policy} does not permit an unknown action" do
    assert_not_permit @current_user, Dummy, :unknown
  end

  test "#{testing_policy} calls for method missing when permitted param" do
    assert_raises NoMethodError do
      policy_instance(@current_user, Dummy).send(:permitted_attributes_for_customaction)
    end
  end

  test "#{testing_policy} calls super for method missing when not action or permitted param" do
    assert_raises NoMethodError do
      policy_instance(@current_user, Dummy).send(:another_method)
    end
  end

  test "#{testing_policy} responds to any action name" do
    assert_respond_to policy_instance(@current_user, Dummy), :unknown?
  end

  test "#{testing_policy} responds to any permitted params" do
    assert_respond_to policy_instance(@current_user, Dummy), :permitted_attributes_for_customaction
  end

  test "#{testing_policy} calls super for respond to when not action or permitted param" do
    assert_not policy_instance(@current_user, Dummy).respond_to? :another_method
  end

  test "#{testing_policy} returns no scope for user" do
    assert_scope_empty @current_user, User
  end

  test "#{testing_policy} returns no scope for nil user" do
    assert_scope_empty nil, User
  end

  ##
  # Permitted params
  ##
  %i[create show update].each do |action_type|
    test "#{testing_policy} permit correct params for #{action_type}" do
      expected = ["#{action_type}_attr"]
      expected += ["display_name"] if action_type == :show
      ar = Rhino::BasePolicyTest::DummyModelPermittedParams.new

      assert_equal expected, policy_instance(@current_user, ar).send("permitted_attributes_for_#{action_type}")
    end
  end
end
