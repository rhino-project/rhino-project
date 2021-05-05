# frozen_string_literal: true

require 'test_helper'

class ParamsTest < ActiveSupport::TestCase
  test 'Blog has create_params' do
    assert_equal([
                   'title', 'published_at', { 'user' => ['id'] }, 'user', { 'category' => ['id'] }, 'category', { 'banner_attachment' => ['id'] }, 'banner_attachment' # rubocop:disable Layout/LineLength
                 ], Blog.new.create_params)
  end

  test 'Blog has show_params' do
    # FIXME: Should create a resource and make sure resource_parent comes back as a read property
    assert_equal(%w[
                   id title published_at created_at updated_at display_name
                 ], Blog.new.show_params)
  end

  NESTED_INCLUDES = { 'og_meta_tags' => ['id', 'tag_name', 'value', { 'blog_post' => ['id'] }, 'blog_post', '_destroy'] }.freeze
  %i[create update].each do |action_type|
    test "BlogPost #{action_type} params include nested og_meta_tags" do
      assert_includes BlogPost.new.send("#{action_type}_params"), NESTED_INCLUDES
    end
  end

  %i[create update show].each do |action_type|
    %i[json jsonb].each do |prop_type| # rubocop:todo Performance/CollectionLiteralInLoop
      test "PropertyList #{action_type} returns #{prop_type} hash" do
        assert_includes PropertyList.new.send("#{action_type}_params"), { "#{prop_type}_prop" => {} }
      end
    end
  end
end
