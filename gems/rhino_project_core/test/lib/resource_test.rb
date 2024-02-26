# frozen_string_literal: true

require "test_helper"

class ResourceTest < ActiveSupport::TestCase
  test "Raises exception on missing policy" do
    exp = assert_raises StandardError do
      class BadPolicy < ApplicationRecord
        rhino_owner_global
        rhino_policy :bad_name
      end
    end
    assert_equal("Policy bad_name not found for ResourceTest::BadPolicy", exp.message)
  end

  test "Finds non-rhino name spaced policy" do
    class GoodPolicy < ApplicationRecord
      rhino_owner_global
      rhino_policy :hippo
    end

    assert_equal(GoodPolicy.policy_class, HippoPolicy)
  end

  test "Finds rhino name spaced policy" do
    assert_equal(BlogDummy.policy_class, Rhino::BlogDummyPolicy)
  end
end
