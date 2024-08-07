# frozen_string_literal: true

require "test_helper"

class CrudControllerDelegatedTypeTest < Rhino::TestCase::ControllerTest
  def setup
    sign_in
  end

  test "creates and returns resource with nested one" do
    parent_attr = { user: @current_user.id, name: "parent", child_one: { name: "child_one" } }

    assert_difference ["Parent.count", "ChildOne.count"], 1 do
      post_api parents_path, params: parent_attr
    end

    assert_response_ok
    assert_equal parent_attr[:name], parsed_response["name"]
    assert_equal parent_attr[:child_one][:name], parsed_response["child_one"]["name"]
  end

  test "creates and returns resource with double nested one" do
    parent_attr = { user: @current_user.id, name: "parent", child_one: { name: "child_one", grand_child_one: { name: "grand_child" } } }

    assert_difference ["Parent.count", "ChildOne.count", "GrandChildOne.count"], 1 do
      post_api parents_path, params: parent_attr
    end

    assert_response_ok
    assert_equal parent_attr[:name], parsed_response["name"]
    assert_equal parent_attr[:child_one][:name], parsed_response["child_one"]["name"]
    assert_equal parent_attr[:child_one][:grand_child_one][:name], parsed_response["child_one"]["grand_child_one"]["name"]
  end

  test "creates and returns resource with nested many" do
    parent_attr = { user: @current_user.id, name: "parent", child_manies: [{ name: "child_many" }] }

    assert_difference ["Parent.count", "ChildMany.count"], 1 do
      post_api parents_path, params: parent_attr
    end

    assert_response_ok
    assert_equal parent_attr[:name], parsed_response["name"]
    assert_equal parent_attr[:child_manies].first[:name], parsed_response["child_manies"].first["name"]
  end

  test "creates and returns resource with double nested many" do
    parent_attr = { user: @current_user.id, name: "parent", child_manies: [{ name: "child_many", grand_child_manies: [{ name: "grand_child" }] }] }

    assert_difference ["Parent.count", "ChildMany.count", "GrandChildMany.count"], 1 do
      post_api parents_path, params: parent_attr
    end

    assert_response_ok
    assert_equal parent_attr[:name], parsed_response["name"]
    assert_equal parent_attr[:child_manies].first[:name], parsed_response["child_manies"].first["name"]
    assert_equal parent_attr[:child_manies].first[:grand_child_manies].first[:name],
                 parsed_response["child_manies"].first["grand_child_manies"].first["name"]
  end
end
