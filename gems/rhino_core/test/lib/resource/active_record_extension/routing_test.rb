# frozen_string_literal: true

require "test_helper"

class ActiveRecordExtensionRoutingTest < ActiveSupport::TestCase
  test "default route key" do
    assert_equal(BlogPost.model_name.route_key, BlogPost.route_key)
  end
end
