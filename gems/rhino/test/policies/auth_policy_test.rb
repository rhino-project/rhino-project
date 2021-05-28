# frozen_string_literal: true

require "test_helper"

class Rhino::AuthPolicyTest < Rhino::TestCase::Policy
  # FIXME: Test callback triggered?
  # FIXME Test scope returns scope?

  test "#{testing_policy} returns no scope for nil user" do
    assert_scope_empty nil, User
  end
end
