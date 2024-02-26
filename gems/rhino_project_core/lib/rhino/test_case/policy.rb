# frozen_string_literal: true

# Based on https://github.com/varvet/pundit/issues/204#issuecomment-60166450 and
# https://github.com/varvet/pundit/issues/204#issuecomment-192256023

module Rhino
  module TestHelperPolicy
    def assert_permit(user, record, action)
      msg = "User #{user.inspect} should be permitted to #{action} #{record}, but isn't permitted"
      assert permit(user, record, action), msg
    end

    def assert_not_permit(user, record, action)
      msg = "User #{user.inspect} should NOT be permitted to #{action} #{record}, but is permitted"
      assert_not permit(user, record, action), msg
    end

    def assert_scope_only(user, scope, expected)
      resolved = scope(user, scope)
      msg = "User #{user.inspect} should be scoped to #{expected.inspect}, but receives #{resolved.inspect}"
      assert_empty resolved.to_a.difference(expected), msg
      assert_empty expected.difference(resolved.to_a), msg
    end

    def assert_params(user, record, action, expected)
      permitted_params = params(user, record, action)
      msg = "User #{user.inspect} should be permitted #{action} params for #{record}, but isn't"
      assert_empty permitted_params.to_a.difference(expected), msg
      assert_empty expected.difference(permitted_params.to_a), msg
    end

    def assert_scope_empty(user, scope)
      resolved = scope(user, scope)
      msg = "User #{user.inspect} should have no scope, but receives #{resolved.inspect}"
      assert_equal 0, resolved.count, msg
    end

    def policy_test_name
      self.class.ancestors.find { |a| a.to_s.end_with?("PolicyTest") }
    end

    def policy_instance(user, record)
      klass = policy_test_name.to_s.gsub(/Test/, "")
      klass.constantize.new(user, record)
    end

    def policy_scope_instance(user, scope)
      klass = policy_test_name.to_s.gsub(/Test/, "::Scope")
      klass.constantize.new(user, scope)
    end

    def scope(user, scope)
      policy_scope_instance(user, scope).resolve
    end

    def permit(user, record, action)
      policy_instance(user, record).public_send("#{action}?")
    end

    def params(user, record, action)
      policy_instance(user, record).public_send("permitted_attributes_for_#{action}")
    end
  end
end

module Rhino
  module TestCase
    class Policy < ActiveSupport::TestCase
      include Rhino::TestHelperPolicy

      def self.testing_policy
        name.gsub(/Test/, "::Scope")
      end
    end
  end
end
