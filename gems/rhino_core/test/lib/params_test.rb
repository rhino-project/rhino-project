# frozen_string_literal: true

require 'test_helper'

class ParamsTest < ActiveSupport::TestCase
  test 'resource has create_params' do
    assert_equal Resource.create_params, [
      'string_prop', 'integer_prop', 'resource_parent', { 'resource_children' => %w[id string_prop resource] }
    ]
  end
end
