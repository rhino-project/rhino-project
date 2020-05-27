# frozen_string_literal: true

require 'test_helper'

class ParamsTest < ActiveSupport::TestCase
  test 'resource has create_params' do
    assert_equal Resource.new.create_params, [
      'string_prop', 'integer_prop', 'resource_parent', { 'resource_children' => %w[id string_prop resource] }
    ]
  end

  test 'resource has show_params' do
    # FIXME: Should create a resource and make sure resource_parent comes back as a read property
    assert_equal Resource.new.show_params, %w[
      id string_prop integer_prop created_at updated_at display_name
    ]
  end
end
