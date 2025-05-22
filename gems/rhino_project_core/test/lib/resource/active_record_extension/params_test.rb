# frozen_string_literal: true

require "test_helper"

class ParamsTest < ActiveSupport::TestCase
  test "Blog has create_params" do
    assert_equal([
                   "title", "published_at", "country", { "user" => ["id"] }, "user", { "blogs_categories" => ["id", { "blog" => ["id"] }, "blog", { "category" => ["id"] }, "category", "_destroy"] }, { "banner_attachment" => ["id"] }, "banner_attachment"
                 ], Blog.create_params)
  end

  test "Blog has show_params" do
    assert_equal([
                   "id", "title", "published_at", "created_at", "updated_at", "country", { "user" => %w[id name nickname email image] }, { "blogs_categories" => ["id", "created_at", "updated_at", { "blog" => %w[id title published_at created_at updated_at country] }, { "category" => %w[id name created_at updated_at] }] }, { "banner_attachment" => ["id", "name", "record_type", "created_at", "url", "url_attachment", { "previews" => {} }, { "representations" => {} }, { "variants" => {} }, "signed_id"] }, { "blog_posts" => ["id", "title", "body", "published", "created_at", "updated_at", "status", { "tag_list" => [] }] }
                 ], Blog.show_params)
  end

  NESTED_INCLUDES = { "og_meta_tags" => ["id", "tag_name", "value", "display_name", { "blog_post" => ["id"] }, "blog_post", "_destroy"] }.freeze
  %i[create update].each do |action_type|
    # FIXME: The update call should fail because tag_name should not be included NUB-844
    test "BlogPost #{action_type} params include nested og_meta_tags" do
      assert_includes BlogPost.send("#{action_type}_params"), NESTED_INCLUDES
    end
  end

  # has_many_attached checks
  %i[create update].each do |action_type|
    test "BlogPost #{action_type} params include image_attachments" do
      assert_includes BlogPost.send("#{action_type}_params"), { "image_attachments" => [] }
    end
  end
  test "BlogPost show params include image_attachments" do
    assert_includes BlogPost.show_params, { "image_attachments" => ["id", "name", "record_type", "created_at", "url", "url_attachment",  { "previews" => {} }, { "representations" => {} }, { "variants" => {} }, "signed_id"] }
  end

  %i[create update show].each do |action_type|
    %i[json jsonb].each do |prop_type|
      test "PropertyList #{action_type} returns #{prop_type} hash" do
        assert_includes PropertyList.new.send("#{action_type}_params"), { "#{prop_type}_prop" => {} }
      end
    end
  end
end
