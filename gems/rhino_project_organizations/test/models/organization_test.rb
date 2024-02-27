# frozen_string_literal: true

require "test_helper"
require "minitest/unit"
require "minitest/autorun"

module OrganizationTest
  class SegmentTest < ActiveSupport::TestCase
    test "should track 'Account Created' when creating new organization" do
      mock = MiniTest::Mock.new
      mock.expect :call, nil
      organization = Organization.new(name: "Org")

      organization.stub :track_account_created, mock do
        organization.save!
      end

      mock.verify
    end

    test "should track 'Account Removed' when deleting organization" do
      mock = MiniTest::Mock.new
      mock.expect :call, nil
      organization = Organization.new(name: "Org")

      organization.stub :track_account_deleted, mock do
        organization.destroy!
      end

      mock.verify
    end
  end
end
