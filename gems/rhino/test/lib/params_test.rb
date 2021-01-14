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
end
