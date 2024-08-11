# frozen_string_literal: true

require "test_helper"

class Rhino::BasePolicyTest < Rhino::TestCase::Policy
  def setup
    @current_user = create(:user)
  end

  class Rhino::BasePolicyTest::DummyModel < ApplicationRecord
    self.table_name = "dummies"

    attribute :create_attr, :string
    attribute :update_attr, :string
    attribute :show_attr, :string

    rhino_properties_read only: %i[show_attr]
    rhino_properties_create only: %i[create_attr]
    rhino_properties_update only: %i[update_attr]
  end

  %i[index show create update destroy].each do |action_type|
    test "#{testing_policy} does not allow #{action_type} for unauthenticated user" do
      assert_not_permit nil, Rhino::BasePolicyTest::DummyModel, action_type
    end

    test "#{testing_policy} does not allow #{action_type} for authenticated user" do
      assert_not_permit @current_user, Rhino::BasePolicyTest::DummyModel, action_type
    end
  end

  test "#{testing_policy} returns no scope for user" do
    assert_scope_empty @current_user, Rhino::BasePolicyTest::DummyModel
  end

  test "#{testing_policy} returns no scope for nil user" do
    assert_scope_empty nil, Rhino::BasePolicyTest::DummyModel
  end

  ##
  # Permitted params
  ##
  %i[create show update].each do |action_type|
    test "#{testing_policy} permit correct params for #{action_type}" do
      expected = ["#{action_type}_attr"]
      expected += ["display_name"] if action_type == :show
      ar = Rhino::BasePolicyTest::DummyModel.new

      assert_equal expected, policy_instance(@current_user, ar).send("permitted_attributes_for_#{action_type}")
    end
  end
end
