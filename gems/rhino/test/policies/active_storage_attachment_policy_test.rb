# frozen_string_literal: true

require "test_helper"

class Rhino::ActiveStorageAttachmentPolicyTest < Rhino::TestCase::Policy
  def setup
    @current_user = create :user
  end

  # Current user
  %i[index update destroy].each do |action_type|
    test "#{testing_policy} does not allow #{action_type} for authenticated user" do
      assert_not_permit @current_user, ActiveStorage::Attachment, action_type
    end
  end

  %i[create show].each do |action_type|
    test "#{testing_policy} allows #{action_type} for authenticated user" do
      assert_permit @current_user, ActiveStorage::Attachment, action_type
    end
  end
end
