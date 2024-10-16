# frozen_string_literal: true

require "test_helper"
require "generators/rhino/model/model_generator"

class ModelGeneratorTest < Rails::Generators::TestCase
  tests Rhino::ModelGenerator
  destination File.expand_path("../tmp", __dir__)
  setup :prepare_destination, :write_rhino_rb

  def test_model_without_owner_option
    content = capture(:stderr) { run_generator ["device_group", "name:string", "user:references"] }
    assert_one_owner_defined content
  end

  def test_model_with_conflicting_global_owner_option
    content = capture(:stderr) { run_generator ["device_group", "name:string", "user:references", "--owner=user", "--global-owner"] }
    assert_one_owner_defined content
  end

  def test_model_with_missing_owner_reference
    content = capture(:stderr) { run_generator ["device_group", "name:string", "--owner=user"] }
    assert_equal "The owner attribute must be a reference attribute\n", content
  end

  def test_model_with_owner_option
    run_generator ["device", "name:string", "device_group:references", "--owner=device_group"]
    assert_file File.join(destination_root, "app/models/device.rb"), /rhino_owner :device_group/
    assert_file File.join(destination_root, "app/models/device.rb"), /rhino_references %i\[device_group\]/
  end

  def test_model_with_base_owner_as_owner_option
    run_generator ["device_group", "name:string", "user:references", "--owner=user"]
    assert_file File.join(destination_root, "app/models/device_group.rb"), /rhino_owner_base/
    assert_file File.join(destination_root, "app/models/device_group.rb"), /rhino_references %i\[user\]/
  end

  def test_model_with_global_owner_as_owner_option
    run_generator ["my_global_model", "name:string", "--owner=global"]
    assert_file File.join(destination_root, "app/models/my_global_model.rb"), /rhino_owner_global/
  end

  def test_model_with_base_owner_indirect_as_owner_option
    run_generator ["my_base_model", "name:string", "user:references", "--owner=base"]
    assert_file File.join(destination_root, "app/models/my_base_model.rb"), /rhino_owner_base/
  end

  def test_model_with_multiple_references
    run_generator ["my_multiple_reference_model", "name:string", "category:references", "blog:references", "--owner=blog"]
    assert_file File.join(destination_root, "app/models/my_multiple_reference_model.rb"), /rhino_owner :blog/
    assert_file File.join(destination_root, "app/models/my_multiple_reference_model.rb"), /rhino_references %i\[category blog\]/
  end

  private
    def prepare_destination
      self.destination_root = File.expand_path("../tmp", __dir__) + "-#{Process.pid}"
      super
    end

    def write_rhino_rb
      rhino_path = File.join(destination_root, "config/initializers")
      FileUtils.mkdir_p(rhino_path)
      File.open("#{rhino_path}/rhino.rb", "w") do |file|
        # Write some content to the file
        file.write("Rhino.setup do |config|\n")
        file.write("end\n")
      end
    end

    def assert_one_owner_defined(content)
      assert_equal "Exactly one owner must be defined on a reference or globally\n", content
    end
end
