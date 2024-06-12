# frozen_string_literal: true

require "test_helper"

class PolicyHelperTest < ActiveSupport::TestCase
  test "finds admin policy with role as string" do
    assert_equal Rhino::AdminPolicy, Rhino::PolicyHelper.find_policy("admin", Blog)
  end

  test "finds admin policy with role as symbol" do
    assert_equal Rhino::AdminPolicy, Rhino::PolicyHelper.find_policy(:admin, Blog)
  end

  test "finds admin policy with Blog instance" do
    assert_equal Rhino::AdminPolicy, Rhino::PolicyHelper.find_policy(:admin, Blog.new)
  end

  test "finds hippo policy" do
    assert_equal HippoPolicy, Rhino::PolicyHelper.find_policy(:hippo, Blog)
  end

  test "finds hippo policy for BlogPost" do
    assert_equal HippoBlogPostPolicy, Rhino::PolicyHelper.find_policy(:hippo, BlogPost)
  end

  test "finds hippo policy for BlogPost instance" do
    assert_equal HippoBlogPostPolicy, Rhino::PolicyHelper.find_policy(:hippo, BlogPost.new)
  end

  test "finds local policy before rhino user policy" do
    assert_equal LocalPolicy, Rhino::PolicyHelper.find_policy(:local, Blog)
  end
end

# Same as above except for Scope
class PolicyScopeHelperTest < ActiveSupport::TestCase
  test "finds admin policy scope with role as string" do
    assert_equal Rhino::AdminPolicy::Scope, Rhino::PolicyHelper.find_policy_scope("admin", Blog)
  end

  test "finds admin policy scope with role as symbol" do
    assert_equal Rhino::AdminPolicy::Scope, Rhino::PolicyHelper.find_policy_scope(:admin, Blog)
  end

  test "finds admin policy scope with Blog instance" do
    assert_equal Rhino::AdminPolicy::Scope, Rhino::PolicyHelper.find_policy_scope(:admin, Blog.new)
  end

  test "finds hippo policy scope" do
    assert_equal HippoPolicy::Scope, Rhino::PolicyHelper.find_policy_scope(:hippo, Blog)
  end

  test "finds hippo policy scope for BlogPost" do
    assert_equal HippoBlogPostPolicy::Scope, Rhino::PolicyHelper.find_policy_scope(:hippo, BlogPost)
  end

  test "finds hippo policy scope for BlogPost instance" do
    assert_equal HippoBlogPostPolicy::Scope, Rhino::PolicyHelper.find_policy_scope(:hippo, BlogPost.new)
  end

  test "finds local policy scope before rhino user policy" do
    assert_equal LocalPolicy::Scope, Rhino::PolicyHelper.find_policy_scope(:local, Blog)
  end
end
