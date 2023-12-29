# frozen_string_literal: true

require "test_helper"

class ActiveRecordExtensionPropertyTest < ActiveSupport::TestCase
  test "required references should not be nullable" do
    assert_not BlogPost.new.describe_property("blog")[:nullable]
  end

  test "optional references should be nullable" do
    skip "No current optional reference"
    assert Blog.new.describe_property("category")[:nullable]
  end

  test "required properties with presence validator should not be nullable" do
    assert_not Blog.new.describe_property("title")[:nullable]
  end

  test "required properties with not null db column should not be nullable" do
    assert_not Blog.new.describe_property("updated_at")[:nullable]
  end

  test "virtual properties should not be writeable" do
    assert ({
      readable: true,
      creatable: false,
      updatable: false
    }) <= EveryField.describe_property("float_virtual")[:"x-rhino-attribute"]
  end

  test "tag list is an array of strings" do
    assert_equal({
      "x-rhino-attribute": {
        name: "tag_list",
        readableName: "Tag List",
        readable: true,
        creatable: true,
        updatable: true
      },
      nullable: true,
      type: :array,
      items: {
        type: "string"
      }
    }, BlogPost.describe_property("tag_list"))
  end

  test "format can be overridden with rhino_properties_format" do
    assert(Blog.describe_property("country") >= { format: :country })
  end

  test "readable name can be overridden with rhino_properties_readable_name" do
    assert(Blog.describe_property("title")[:"x-rhino-attribute"] >= { readableName: "Blog Title" })
  end

  # NUB-347
  test "foreign key symbols should be removed from readable properties" do
    assert_equal(%w[id title published_at created_at updated_at country user blogs_categories banner_attachment blog_posts], Blog.read_properties)
  end
end
