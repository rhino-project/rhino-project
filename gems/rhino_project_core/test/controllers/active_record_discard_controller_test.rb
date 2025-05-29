# frozen_string_literal: true

require "test_helper"

class ActiveRecordDiscardControllerTest < Rhino::TestCase::ControllerTest
  def setup
    sign_in
    @blog = create(:blog_discard, user: @current_user)
    @alternate_primary_key = create(:alternate_primary_key, user: @current_user)
  end

  test "index returns results" do
    get_api blog_discards_path

    assert_response_ok
    assert_equal 1, parsed_response["total"]
    assert_equal @blog.title, parsed_response["results"][0]["title"]
  end

  test "index returns results for non-id primary key" do
    get_api alternate_primary_keys_path

    assert_response_ok
    assert_equal 1, parsed_response["total"]
    assert_equal @alternate_primary_key.name, parsed_response["results"][0]["name"]
  end

  test "show returns resource" do
    get_api blog_discard_path(@blog)

    assert_response_ok
    assert_equal @blog.id, parsed_response["id"]
    assert_equal @blog.title, parsed_response["title"]
  end

  test "creates and returns resource" do
    blog_attr = attributes_for(:blog_discard).merge(user: @current_user.id)

    assert_difference [ "BlogDiscard.count", "BlogDiscard.kept.count" ], 1 do
      post_api blog_discards_path, params: blog_attr
    end

    assert_response_ok
    assert_equal blog_attr[:title], parsed_response["title"]
  end

  test "updates and returns resource" do
    updated_title = attributes_for(:blog_discard)[:title]

    patch_api blog_discard_path(@blog), params: { title: updated_title }

    assert_response_ok
    assert_equal @blog.id, parsed_response["id"]
    assert_equal updated_title, parsed_response["title"]
  end

  test "discards and returns resource" do
    assert_difference -> { BlogDiscard.count } => 0, -> { BlogDiscard.kept.count } => -1 do
      delete_api blog_discard_path(@blog)
    end

    assert_response_ok
    assert_equal @blog.id, parsed_response["id"]
    assert_equal @blog.title, parsed_response["title"]
  end
end

class ActiveRecordDiscardControllerrUnauthorizedTest < Rhino::TestCase::ControllerTest
  def setup
    sign_in

    @another_user = create(:user)
    @blog = create(:blog_discard, user: @another_user)
  end

  test "index does not contain resource for another user" do
    get_api blog_discards_path

    assert_response_ok
    assert_equal 0, parsed_response["total"]
  end

  test "show does not find resource for another user" do
    get_api blog_discard_path(@blog)

    assert_response_not_found
  end

  test "creates does not create resource for another user" do
    blog_attr = attributes_for(:blog_discard).merge(user: @another_user.id)

    assert_no_difference "BlogDiscard.kept.count" do
      post_api blog_discards_path, params: blog_attr
    end

    assert_response_forbidden
  end

  test "cannot update blog for another user" do
    updated_title = attributes_for(:blog_discard)[:title]

    patch_api blog_discard_path(@blog), params: { title: updated_title }

    assert_response_forbidden
  end

  test "cannot discard blog for another user" do
    assert_no_difference [ "BlogDiscard.count", "BlogDiscard.kept.count" ] do
      delete_api blog_discard_path(@blog)
    end

    assert_response_forbidden
  end
end

class ActiveRecordDiscardControllerUnauthenticatedTest < Rhino::TestCase::ControllerTest
  def setup
    sign_in
    sign_out

    @blog = create(:blog_discard, user: @current_user)
  end

  test "index unauthorized for unauthenticated user" do
    get_api blog_discards_path

    assert_response_unauthorized
  end

  test "show unauthorized for unauthenticated user" do
    get_api blog_discard_path(@blog)

    assert_response_unauthorized
  end

  test "create unauthorized for unauthenticated user" do
    blog_attr = attributes_for(:blog_discard).merge(user: @current_user.id)

    assert_no_difference "BlogDiscard.kept.count" do
      post_api blog_discards_path, params: blog_attr
    end

    assert_response_unauthorized
  end

  test "update unauthorized for unauthenticated user" do
    updated_title = attributes_for(:blog_discard)[:title]

    patch_api blog_discard_path(@blog), params: { title: updated_title }

    assert_response_unauthorized
  end

  test "destroy unauthorized for unauthenticated user" do
    assert_no_difference [ "BlogDiscard.count", "BlogDiscard.kept.count" ] do
      delete_api blog_discard_path(@blog)
    end

    assert_response_unauthorized
  end
end
