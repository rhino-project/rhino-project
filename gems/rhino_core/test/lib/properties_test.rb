# frozen_string_literal: true

require 'test_helper'

class PropertyTest < ActiveSupport::TestCase
  test 'read properties can mark only' do
    assert_equal PropertyResource.new.read_properties, %w[
      prop_one prop_two prop_three
    ]
  end

  test 'create properties can mark except' do
    assert_equal PropertyResource.new.create_properties, %w[
      prop_two prop_three prop_four prop_five prop_six
    ]
  end

  test 'update properties can mark except' do
    assert_equal PropertyResource.new.update_properties, %w[
      prop_one prop_two prop_three prop_four prop_five prop_six
    ]
  end
end
