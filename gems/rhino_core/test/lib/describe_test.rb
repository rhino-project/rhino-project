# frozen_string_literal: true

require "test_helper"

class DescribeTestDummyModelSearchableComplete < ApplicationRecord
  self.table_name = "dummies"
  rhino_search [], { model: [:a_field] }
end

class DescribeTestDummyModelSearchableNested < ApplicationRecord
  self.table_name = "dummies"
  rhino_search [], { model: { another_model: [:a_field] } }
end

class DescribeTestDummyModelSearchableEmpty < ApplicationRecord
  self.table_name = "dummies"
  rhino_search []
end

class DescribeTestDummyModelSearchableNoFields < ApplicationRecord
  self.table_name = "dummies"
  rhino_search [], { model: [] }
end

class DescribeTestDummyModelSearchableNestedEmpty < ApplicationRecord
  self.table_name = "dummies"
  rhino_search [], { model: { another_model: [] } }
end

class DescribeTestDummyModelNotSearchable < ApplicationRecord
  self.table_name = "dummies"
end

class DescribeTest < ActiveSupport::TestCase
  test "x-rhino-model searchable is true if there is at least one element in rhino_search list" do
    # Blog has rhino_search [:title]
    assert Blog.describe[:'x-rhino-model'][:searchable]
    # BlogPost doesn't have any search set
    assert_not BlogPost.describe[:'x-rhino-model'][:searchable]
  end

  test "x-rhino-model searchable is true when rhino_search fields are empty, but the associated fields are not" do
    assert DescribeTestDummyModelSearchableComplete.describe[:'x-rhino-model'][:searchable]
  end

  test "x-rhino-model searchable is true when rhino_search associated fields have nested model fields " do
    assert DescribeTestDummyModelSearchableNested.describe[:'x-rhino-model'][:searchable]
  end

  test "x-rhino-model searchable is false when both rhino_search fields and associated fields are empty" do
    assert_not DescribeTestDummyModelSearchableEmpty.describe[:'x-rhino-model'][:searchable]
  end

  test "x-rhino-model searchable is true when rhino_search fields are empty and the associated fields only have empty keys" do
    assert DescribeTestDummyModelSearchableNoFields.describe[:'x-rhino-model'][:searchable]
  end

  test "x-rhino-model searchable is true when rhino_search fields are empty and the associated fields only have empty keys, even if nested" do
    assert DescribeTestDummyModelSearchableNestedEmpty.describe[:'x-rhino-model'][:searchable]
  end

  test "x-rhino-model searchable is false when rhino_search is not called at all" do
    assert_not DescribeTestDummyModelNotSearchable.describe[:'x-rhino-model'][:searchable]
  end
end
