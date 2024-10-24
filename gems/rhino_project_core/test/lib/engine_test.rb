# frozen_string_literal: true

require "test_helper"

class EngineTest < ActiveSupport::TestCase
  class BadResource < ApplicationRecord
    # rhino_owner_base
    rhino_references %i[user banner_attachment] + [{ blog: [:blog_posts] }]
  end

  test "raises error if no owner" do
    exp = assert_raises StandardError do
      Rhino::Engine.check_ownership(BadResource)
    end
    assert_equal("EngineTest::BadResource does not have rhino ownership set", exp.message)
  end

  test "raises error if no association for reference" do
    exp = assert_raises StandardError do
      Rhino::Engine.check_references(BadResource)
    end
    assert_equal("EngineTest::BadResource has references [:user, :banner_attachment, :blog] that do not exist as associations", exp.message)
  end

  test "raises error if owner is not a reference" do
    class BadResourceNoOwnerRef < ApplicationRecord
      belongs_to :user

      rhino_owner_base
    end
    exp = assert_raises StandardError do
      Rhino::Engine.check_owner_reference(BadResourceNoOwnerRef)
    end
    assert_equal("EngineTest::BadResourceNoOwnerRef does not have a reference to its owner user", exp.message)
  end
end
