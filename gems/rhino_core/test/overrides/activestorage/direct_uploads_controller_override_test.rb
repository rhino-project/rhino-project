# frozen_string_literal: true

class OverridesActiveStorageDirectUploadsControllerOverrideTest < Rhino::TestCase::Override
  test "active storage direct uploads controller is overridden" do
    assert_overridden "#{__dir__}/../../../app/overrides/activestorage/direct_uploads_controller_override.rb",
                      ActiveStorage::DirectUploadsController, :create
  end
end
