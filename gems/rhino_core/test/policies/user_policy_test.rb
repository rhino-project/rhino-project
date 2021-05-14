# frozen_string_literal: true

require "test_helper"

class Rhino::UserPolicyTest < PolicyTestCase
  def setup
    @current_user = create :user
    @another_user = create :user
  end

  %i[index show create update destroy].each do |action_type|
    test "#{self.class} does not allow #{action_type} for unauthenticated user" do
      assert_not_permit nil, nil, action_type
    end
  end

  %i[create destroy].each do |action_type|
    test "#{self.class} does not allow #{action_type} for authenticated user" do
      assert_not_permit @current_user, @current_user, action_type
    end
  end

  %i[index show update].each do |action_type|
    test "#{self.class} allows #{action_type} for authenticated user" do
      assert_permit @current_user, @current_user, action_type
    end
  end

  %i[update].each do |action_type|
    test "#{self.class} does not allow #{action_type} for another user" do
      assert_not_permit @current_user, @another_user, action_type
    end
  end
end
