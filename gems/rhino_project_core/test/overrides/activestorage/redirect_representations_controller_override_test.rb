# frozen_string_literal: true

class OverridesActiveStorageRepresentationsRedirectControllerOverrideTest < Rhino::TestCase::Override
  test "active storage redirect controller is overridden" do
    assert_overridden "#{__dir__}/../../../app/overrides/activestorage/redirect_representation_controller_override.rb",
                      ActiveStorage::Representations::RedirectController, :show
  end
end
