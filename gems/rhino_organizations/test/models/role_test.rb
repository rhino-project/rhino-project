# frozen_string_literal: true

require "test_helper"

class Rhino::RoleTest < ActiveSupport::TestCase
  test "not allow nil name" do
    assert_not Role.new(name: nil).valid?
  end

  test "not allow empty name" do
    assert_not Role.new(name: "").valid?
  end

  test "not allow space in name" do
    assert_not Role.new(name: "test name").valid?
  end

  test "not allow duplicate names" do
    role = create :role
    assert_not Role.new(name: role.name).valid?
  end
end
