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

  test "Defaults to global policy if global" do
    assert_equal(Rhino::GlobalPolicy, Category.policy_class)
  end

  test "Defaults to crud policy if not global" do
    assert_equal(Rhino::CrudPolicy, Blog.policy_class)
  end

  test "Finds non-rhino name spaced policy" do
    class NameSpacePolicy < ApplicationRecord
      rhino_owner_global
      rhino_policy :hippo
    end

    assert_equal(NameSpacePolicy.policy_class, HippoPolicy)
  end

  test "Finds non-rhino name spaced policy before rhino poloicy" do
    class NonNameSpacePolicy < ApplicationRecord
      rhino_owner_global
      rhino_policy :local
    end

    assert_equal(NonNameSpacePolicy.policy_class, LocalPolicy)
  end

  test "Finds rhino name spaced policy" do
    assert_equal(BlogDummy.policy_class, Rhino::BlogDummyPolicy)
  end
end
