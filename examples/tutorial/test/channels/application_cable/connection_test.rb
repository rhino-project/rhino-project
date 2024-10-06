# frozen_string_literal: true

require "test_helper"

class ApplicationCable::ConnectionTest < ActionCable::Connection::TestCase
  test "connects with cookies" do
    user = create(:user)

    cookies[DeviseTokenAuth.cookie_name] = user.create_new_auth_token.to_json

    connect

    assert_equal user, connection.current_user
  end

  test "rejects connection when not signed in" do
    assert_reject_connection { connect }
  end

  test "rejects connection with empty cookies" do
    cookies[DeviseTokenAuth.cookie_name] = nil.to_json

    assert_reject_connection { connect }
  end

  test "rejects connection with bad cookies" do
    cookies[DeviseTokenAuth.cookie_name] = {
      "access-token" => "1234",
      "uid" => "1234",
      "client" => "1234"
    }.to_json

    assert_reject_connection { connect }
  end
end
