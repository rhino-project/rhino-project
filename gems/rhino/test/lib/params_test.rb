# frozen_string_literal: true

require 'test_helper'

class ParamsTest < ActiveSupport::TestCase
  test 'Blog has create_params' do
    assert_equal Blog.new.create_params, %w[
      title published_at user category banner_attachment
    ]
  end

  test 'Blog has show_params' do
    # FIXME: Should create a resource and make sure resource_parent comes back as a read property
    assert_equal Blog.new.show_params, %w[
      id title published_at created_at updated_at display_name
    ]
  end

  NESTED_INCLUDES = { 'og_meta_tags' => %w[id tag_name value blog_post _destroy] }.freeze
  %i[create update].each do |action_type|
    test "BlogPost #{action_type} params include nested og_meta_tags" do
      assert_includes BlogPost.new.send("#{action_type}_params"), { 'og_meta_tags' => %w[id tag_name value blog_post _destroy] }
    end
  end
end
