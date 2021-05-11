# frozen_string_literal: true

# Based on https://github.com/varvet/pundit/issues/204#issuecomment-60166450

module TestHelperPolicy
  def assert_permit(user, record, action)
    msg = "User #{user.inspect} should be permitted to #{action} #{record}, but isn't permitted"
    assert permit(user, record, action), msg # rubocop:disable Minitest/AssertWithExpectedArgument
  end

  def assert_not_permit(user, record, action)
    msg = "User #{user.inspect} should NOT be permitted to #{action} #{record}, but is permitted"
    assert_not permit(user, record, action), msg
  end

  def permit(user, record, action)
    test_name = self.class.ancestors.find { |a| a.to_s.end_with?("PolicyTest") }
    klass = test_name.to_s.gsub(/Test/, "")
    klass.constantize.new(user, record).public_send("#{action}?")
  end
end

class PolicyTestCase < ActiveSupport::TestCase
  include TestHelperPolicy
end
