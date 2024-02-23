# frozen_string_literal: true

class OverridesActiveStorageBlobsRedirectControllerOverrideTest < Rhino::TestCase::Override
  test "active storage redirect controller is overridden" do
    assert_overridden "#{__dir__}/../../../app/overrides/activestorage/redirect_controller_override.rb",
                      ActiveStorage::Blobs::RedirectController, :show
  end
end
