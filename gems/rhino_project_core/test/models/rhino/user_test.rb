# frozen_string_literal: true

require "test_helper"
require "minitest/unit"
require "minitest/autorun"

module UserTest
  class SegmentTest < ActiveSupport::TestCase
    test "should track 'Signed Up' when creating new user" do
      mock = MiniTest::Mock.new
      mock.expect :call, nil
      user = User.new(email: "test@test.com", password: "password")

      user.stub :track_sign_up, mock do
        user.save!
      end

      assert mock.verify
    end
  end
end
