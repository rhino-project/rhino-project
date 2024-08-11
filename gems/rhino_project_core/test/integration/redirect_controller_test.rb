# frozen_string_literal: true

require "test_helper"

class RedirectControllerTest < Rhino::TestCase::ControllerTest
  def setup
    @blog = create(:blog)
  end

  test "active storage allows authenticated redirects" do
    sign_in(@blog.user)

    get_api banner_path

    assert_response :redirect
  end

  test "active storage does not allow anonymous redirects" do
    get_api banner_path

    assert_response_unauthorized
  end

  private
    # @blog.banner_attachment returns a full path with host which is not suitable for test calls
    def banner_path
      Rails.application.routes.url_helpers.rails_blob_url(@blog.banner_attachment, only_path: true)
    end
end
