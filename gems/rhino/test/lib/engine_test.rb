# frozen_string_literal: true

require 'test_helper'

class EngineTest < ActiveSupport::TestCase
  class BadResource < ApplicationRecord
    # rhino_owner_base
    rhino_references %i[user banner_attachment] + [{ blog: [:blog_posts] }]
  end

  test 'raises error if no owner' do
    exp = assert_raises StandardError do
      Rhino::Engine.check_ownership(BadResource)
    end
    assert_equal exp.message, 'EngineTest::BadResource does not have rhino ownership set'
  end

  test 'raises error if no association for reference' do
    exp = assert_raises StandardError do
      Rhino::Engine.check_references(BadResource)
    end
    assert_equal exp.message, 'EngineTest::BadResource has references [:user, :banner_attachment, :blog] that do not exist as associations'
  end
end
