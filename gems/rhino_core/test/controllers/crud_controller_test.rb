# frozen_string_literal: true

require "test_helper"

class CrudControllerTest < Rhino::TestCase::ControllerTest
  test "creates blog" do
    sign_in
    post blogs_path, params: { crud: { user: @current_user.id, title: "Test Blog" } }, xhr: true

    assert_response_ok
  end
end
