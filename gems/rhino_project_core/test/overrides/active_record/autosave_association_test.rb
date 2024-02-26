# frozen_string_literal: true

require "test_helper"

module ActiveRecord
  class AutosaveAssociationTest < ActiveSupport::TestCase
    def setup
      @blog = create :blog
    end

    test "allow meta tags with filled values" do
      og_meta_tag0 = OgMetaTag.new(tag_name: "tag0", value: "val0")
      og_meta_tag1 = OgMetaTag.new(tag_name: "tag1", value: "val1")
      og_meta_tags = [og_meta_tag0, og_meta_tag1]

      create :blog_post, title: "blog_post_title", body: "blog_post_body", blog: @blog, og_meta_tags: og_meta_tags

      assert_equal 2, og_meta_tags.size
    end

    test "should not allow meta tags with nil value" do
      og_meta_tag0 = OgMetaTag.new(tag_name: "tag0", value: "val0")
      og_meta_tag1 = OgMetaTag.new(tag_name: "tag1", value: nil)
      og_meta_tags = [og_meta_tag0, og_meta_tag1]

      exp = assert_raises ActiveRecord::RecordInvalid do
        create :blog_post, title: "blog_post_title", body: "blog_post_body", blog: @blog, og_meta_tags:
      end

      assert_equal "Validation failed: Og meta tags[1] value can't be blank", exp.message
    end

    test "should show error in tags[1]" do
      og_meta_tag0 = OgMetaTag.new(tag_name: "tag0", value: "val0")
      og_meta_tag1 = OgMetaTag.new(tag_name: "tag1", value: "val1")
      blog_post = create :blog_post, title: "blog_post_title", body: "blog_post_body", blog: @blog, og_meta_tags: [og_meta_tag0, og_meta_tag1]
      blog_post.og_meta_tags[1].value = nil

      exp = assert_raises ActiveRecord::RecordInvalid do
        blog_post.save!
      end

      assert_equal "Validation failed: Og meta tags[1] value can't be blank", exp.message
    end
  end
end
