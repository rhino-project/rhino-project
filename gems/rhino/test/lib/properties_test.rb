# frozen_string_literal: true

require 'test_helper'

class PropertyTest < ActiveSupport::TestCase
  test 'required references should not be nullable' do
    assert_not BlogPost.new.describe_property('blog')[:nullable]
  end

  test 'optional references should be nullable' do
    assert Blog.new.describe_property('category')[:nullable]
  end

  test 'required properties with presence validator should not be nullable' do
    assert_not Blog.new.describe_property('title')[:nullable]
  end

  test 'required properties with not null db column should not be nullable' do
    assert_not Blog.new.describe_property('updated_at')[:nullable]
  end

  test 'read properties can be marked only' do
    assert_equal(%w[id name nickname email image], User.new.read_properties)
  end

  test 'create properties can be marked only' do
    assert_equal(%w[name nickname email], User.new.create_properties)
  end

  test 'update properties can be marked only' do
    assert_equal(%w[name nickname], User.new.update_properties)
  end

  test 'tag list is an array of strings' do
    assert_equal({
      "x-rhino-attribute": {
        name: 'tag_list',
        readableName: 'Tag List',
        readable: true,
        creatable: true,
        updatable: true
      },
      nullable: true,
      type: :array,
      items: {
        type: 'string'
      }
    }, BlogPost.describe_property('tag_list'))
  end

  # NUB-347
  test 'foreign key symbols should be removed from readable properties' do
    assert_equal(%w[id title published_at created_at updated_at user category banner_attachment blog_posts], Blog.read_properties)
  end
end
