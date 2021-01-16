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
    assert_equal User.new.read_properties, %w[id uid name email]
  end

  test 'create properties can be marked only' do
    assert_equal User.new.create_properties, %w[name nickname email]
  end

  test 'update properties can be marked only' do
    assert_equal User.new.update_properties, %w[name nickname]
  end

  test 'tag list is an array of strings' do
    assert_equal BlogPost.describe_property('tag_list'), {
      name: 'tag_list',
      readableName: 'Tag List',
      readable: true,
      creatable: true,
      updatable: true,
      nullable: true,
      type: :array,
      items: {
        type: 'string'
      }
    }
  end

  # NUB-347
  test 'foreign key symbols should be removed from readable properties' do
    assert_equal Blog.read_properties, %w[id title published_at created_at updated_at user category banner_attachment blog_posts]
  end
end
