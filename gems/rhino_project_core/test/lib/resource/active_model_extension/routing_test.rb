# frozen_string_literal: true

require "test_helper"

class ActiveModelExtensionRoutingTest < ActiveSupport::TestCase
  test "default route key" do
    assert_equal(GoogleSheet.model_name.route_key, GoogleSheet.route_key)
  end
end
