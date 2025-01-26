# frozen_string_literal: true

require "test_helper"
require "generators/rhino/admin/admin_generator"

class AdminGeneratorTest < Rails::Generators::TestCase
  tests Rhino::AdminGenerator
  destination File.expand_path("../tmp", __dir__)
  setup :prepare_destination

  def test_admin
    run_generator ["device_group"]
    assert_file File.join(destination_root, "app/admin/device_groups.rb"), "ActiveAdmin.register DeviceGroup do\n  rhino_filters\n  rhino_permit_params\nend\n"
  end

  private
    def prepare_destination
      self.destination_root = File.expand_path("../tmp", __dir__) + "-#{Process.pid}"
      super
    end
end
