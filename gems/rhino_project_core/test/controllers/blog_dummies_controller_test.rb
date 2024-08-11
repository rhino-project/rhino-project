# frozen_string_literal: true

require "test_helper"

class BlogDummiesControllerTest < Rhino::TestCase::ControllerTest
  def setup
    sign_in
    @blog = create(:blog, user: @current_user)
    @blog_dummy = create(:blog_dummy, blog: @blog)
  end

  test "creates and returns resource" do
    blog_dummy_attr = { name: "Test__!", blog_id: @blog.id }

    assert_difference "BlogDummy.count", 1, "BlogDummy was not created, maybe parameters are not being correctly wrapped under :crud" do
      post_api blog_dummies_path, params: blog_dummy_attr
    end

    assert_response_ok
    assert_equal blog_dummy_attr[:name], parsed_response["name"]
  end
end
