# frozen_string_literal: true

require "test_helper"

module ActiveRecord
  class NestedError < ActiveSupport::TestCase
    def setup
      @blog = create(:blog)
    end

    test "allow meta tags with filled values" do
      og_meta_tag0 = OgMetaTag.new(tag_name: "tag0", value: "val0")
      og_meta_tag1 = OgMetaTag.new(tag_name: "tag1", value: "val1")
      og_meta_tags = [og_meta_tag0, og_meta_tag1]

      create(:blog_post, title: "blog_post_title", body: "blog_post_body", blog: @blog, og_meta_tags:)

      assert_equal 2, og_meta_tags.size
    end

    test "should not allow meta tags with nil value" do
      og_meta_tags_attributes = [{ tag_name: "tag0", value: "val0" }, { tag_name: "tag1", value: nil }]

      exp = assert_raises ActiveRecord::RecordInvalid do
        BlogPost.create!(title: "blog_post_title", body: "blog_post_body", blog_id: @blog.id, og_meta_tags_attributes:)
      end

      assert_equal "Validation failed: Og meta tags 1 value can't be blank", exp.message
    end

    test "should show error in tags[1]" do
      og_meta_tags_attributes = [{ tag_name: "tag0", value: "val0" }, { tag_name: "tag1", value: "val1" }]
      blog_post = BlogPost.create!(title: "blog_post_title", body: "blog_post_body", blog_id: @blog.id, og_meta_tags_attributes:)

      exp = assert_raises ActiveRecord::RecordInvalid do
        og_meta_tags_attributes = [{ tag_name: "tag0", value: "val0" }, { tag_name: "tag1", value: nil }]
        blog_post.update!(og_meta_tags_attributes:)
      end

      assert_equal "Validation failed: Og meta tags 1 value can't be blank", exp.message
    end
  end
end
