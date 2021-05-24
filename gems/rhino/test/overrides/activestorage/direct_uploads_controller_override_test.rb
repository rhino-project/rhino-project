# frozen_string_literal: true

class OverridesActiveStorageDirectUploadsControllerOverrideTest < ActiveSupport::TestCase
  test "active storage direct uploads controller is overridden" do
    assert_equal File.realpath("#{__dir__}/../../../app/overrides/activestorage/direct_uploads_controller_override.rb"),
                 ActiveStorage::DirectUploadsController.new.method(:create).source_location[0]
  end
end
