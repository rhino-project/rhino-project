# frozen_string_literal: true

require "test_helper"

class ModelAssertions < Rhino::TestCase::ModelTest
  def setup
    @model = Blog
  end

  test "test assert_required" do
    assert_required :title
  end

  test "test assert_not_required" do
    assert_not_required :country
  end

  test "test assert_association_required" do
    assert_association_required :user
  end
end
