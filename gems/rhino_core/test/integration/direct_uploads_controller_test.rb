# frozen_string_literal: true

require "test_helper"

class DirectUploadsControllerTest < Rhino::TestCase::ControllerTest
  BLOB_INFO = {
    blob: {
      byte_size: 58_776,
      checksum: "1MLBG79ze7v3Um9VS/AMCg==",
      content_type: "image/jpeg",
      filename: "Image1.JPG"
    }
  }.freeze

  test "active storage direct uploads allows authenticated uploads" do
    sign_in

    post "/rails/active_storage/direct_uploads", params: BLOB_INFO, xhr: true

    assert_response_ok
  end

  test "active storage direct uploads does not allow anonymous uploads" do
    post "/rails/active_storage/direct_uploads", params: BLOB_INFO, xhr: true

    assert_response_unauthorized
  end
end
