# frozen_string_literal: true

require "test_helper"

class SievesTest < ActiveSupport::TestCase
  test "Limit sieve defaults to 20" do
    blog_sieve = Blog.rhino_sieves.find { |s| s == Rhino::Sieve::Limit }
    assert_equal [{ default_limit: 20 }], blog_sieve.args
  end

  test "Limit sieve can be overridden" do
    blog_sieve = Category.rhino_sieves.find { |s| s == Rhino::Sieve::Limit }
    assert_equal [{ default_limit: nil }], blog_sieve.args
  end
end
