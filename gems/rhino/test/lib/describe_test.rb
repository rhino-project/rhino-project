# frozen_string_literal: true

require "test_helper"

class DescribeTest < ActiveSupport::TestCase
  test "x-rhino-model searchable is true if there is at least one element in rhino_search list" do
    # Blog has rhino_search [:title]
    assert Blog.describe[:'x-rhino-model'][:searchable]
    # BlogPost doesn't have any search set
    assert_not BlogPost.describe[:'x-rhino-model'][:searchable]
  end
end
