# frozen_string_literal: true

class OverridesRhinoAccount < Rhino::TestCase::Override
  test "Rhino::Account model is overridden" do
    assert_includes Rhino::Account.read_properties, "users_roles"
    assert_includes Rhino::Account.references, users_roles: %i[organization role]
  end
end
