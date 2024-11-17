# frozen_string_literal: true

require "test_helper"

class ActiveRecordTreeTest < ActiveSupport::TestCase
  test "read_properties includes children" do
    assert_equal %w[id ancestry created_at updated_at children],
                 ActiveRecordTreeDummy.read_properties
  end

  test "show_params includes children" do
    assert_equal ["id", "ancestry", "created_at", "updated_at", "display_name", { children: [%w[id ancestry created_at updated_at display_name]] }],
                 ActiveRecordTreeDummy.show_params
  end

  test "describes children" do
    assert_equal "{\"x-rhino-attribute\":{\"name\":\"children\",\"readableName\":\"Children\",\"readable\":true,\"creatable\":false,\"updatable\":false},\"readOnly\":true,\"nullable\":true,\"type\":\"array\",\"items\":{\"type\":\"reference\",\"anyOf\":[{\"$ref\":\"#/components/schemas/active_record_tree_dummy\"}]}}",
                 ActiveRecordTreeDummy.describe_property("children").to_json
  end
end
