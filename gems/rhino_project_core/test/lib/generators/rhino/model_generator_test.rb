# frozen_string_literal: true

require "test_helper"
require "generators/rhino/model/model_generator"

class ModelGeneratorTest < Rails::Generators::TestCase
  tests Rhino::ModelGenerator
  destination Rails.root.join("tmp/generators")
  setup :prepare_destination

  def setup
    write_rhino_rb
  end

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
    assert_file Rails.root.join("tmp/generators/app/models/device.rb"), /rhino_owner :device_group/
    assert_file Rails.root.join("tmp/generators/app/models/device.rb"), /rhino_references %i\[device_group\]/
  end

  def test_model_with_base_owner_as_owner_option
    run_generator ["device_group", "name:string", "user:references", "--owner=user"]
    assert_file Rails.root.join("tmp/generators/app/models/device_group.rb"), /rhino_owner_base/
    assert_file Rails.root.join("tmp/generators/app/models/device_group.rb"), /rhino_references %i\[user\]/
  end

  private
    def write_rhino_rb
      rhino_path = Rails.root.join("tmp/generators/config/initializers")
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
