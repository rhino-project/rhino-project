# frozen_string_literal: true

require "test_helper"

# Tests the high resource property manipulations
# See also the implementation specific interface tests
class PropertyTest < ActiveSupport::TestCase
  %w[read create update].each do |property_type|
    test "#{property_type} properties are returned" do
      all_class = new_isolated_property_class

      assert_equal PropertyList.property_list(property_type),
                   all_class.send("#{property_type}_properties")
    end

    test "#{property_type} properties can use only" do
      only_prop = "#{property_type}_property_0"
      only_class = new_isolated_property_class("rhino_properties_#{property_type} only: [\"#{only_prop}\"]")

      assert_equal [only_prop], only_class.send("#{property_type}_properties")
    end

    test "#{property_type} properties can use except" do
      except_prop = "#{property_type}_property_0"
      except_class = new_isolated_property_class("rhino_properties_#{property_type} except: [\"#{except_prop}\"]")

      assert_equal PropertyList.property_list(property_type) - [except_prop],
                   except_class.send("#{property_type}_properties")
    end

    test "#{property_type} properties validity" do
      all_class = new_isolated_property_class

      assert all_class.send("#{property_type}_property?", "#{property_type}_property_0")
      assert_not all_class.send("#{property_type}_property?", "#{property_type}_property_invalid")
    end
  end

  test "only read, create and update properties are returned" do
    except_string = <<~END_EXCEPT
      rhino_properties_read except: :read_property_0
      rhino_properties_create except: :create_property_0
      rhino_properties_update except: :update_property_0
    END_EXCEPT
    except_class = new_isolated_property_class(except_string)

    all_props = (PropertyList.property_list("read") +
      PropertyList.property_list("create") +
      PropertyList.property_list("update")).uniq -
                %w[read_property_0 create_property_0 update_property_0]

    assert_equal all_props, except_class.all_properties
  end

  %w[read create update].each do |property_type|
    test "property? validates #{property_type} property" do
      all_class = new_isolated_property_class

      assert all_class.property?("#{property_type}_property_0")
      assert_not all_class.property?("#{property_type}_property_invalid")
    end
  end

  private
    class PropertyList
      include Rhino::Resource

      def self.identifier_property
        "resource_id"
      end

      def self.property_list(base_name)
        Array.new(3) { |idx| "#{base_name}_property_#{idx}" }
      end

      # Implement the properties interface
      def self.readable_properties
        property_list("read")
      end

      def self.creatable_properties
        property_list("create")
      end

      def self.updatable_properties
        property_list("update")
      end
    end

    # This is needed to isolate class_attribute assignments for each test case.
    # https://github.com/rails/rails/blob/0c1ed54a2ad02a14433fda0655a2ead399d06c9e/activerecord/test/cases/migration_test.rb#L1075
    def new_isolated_property_class(eval_string = nil)
      isolated_class = Class.new(PropertyList)
      isolated_class.class_eval(eval_string) if eval_string

      isolated_class
    end
end
