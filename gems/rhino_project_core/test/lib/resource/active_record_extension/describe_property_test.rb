# frozen_string_literal: true

require "test_helper"

module ActiveRecordExtension
  class DescribePropertiesTest < ActiveSupport::TestCase # rubocop:todo Metrics/ClassLength
    test "non-existent property raises an exception" do
      assert_raises(StandardError) { EveryField.describe_property("does_not_exist") }
    end

    test "identifier" do
      assert_type("id", :identifier)
    end

    test "string" do
      assert_type("string", :string)
    end

    test "string inclusion" do
      assert_type("string_inclusion", :string)
      assert_equal(%w[test example], @description[:enum])
    end

    test "string length minimum" do
      assert_type("string_length_min", :string)
      assert_equal(2, @description[:minLength])
    end

    test "string length maximum" do
      assert_type("string_length_max", :string)
      assert_equal(5, @description[:maxLength])
    end

    test "string length range" do
      assert_type("string_length_range", :string)
      assert_equal(2, @description[:minLength])
      assert_equal(5, @description[:maxLength])
    end

    test "string length exact" do
      assert_type("string_length_exact", :string)
      assert_equal(2, @description[:minLength])
      assert_equal(2, @description[:maxLength])
    end

    test "string pattern" do
      assert_type("string_pattern", :string)
      assert_equal("^[Tt][a-zA-Z]+$", @description[:pattern])
    end

    test "string write only" do
      assert_type("string_write_only", :string)
      assert(@description[:writeOnly])
    end

    test "string overrideable" do
      assert_type("string_overrideable", :string)
      assert_equal("Overriden name", @description[:"x-rhino-attribute"][:readableName])
    end

    test "overriding a field does not affect other tables containing a field with the same name" do
      assert_type("string_overrideable", :string)
      description_dummy = EveryFieldDummy.describe_property("string_overrideable")
      assert_equal("Overriden name", @description[:"x-rhino-attribute"][:readableName])
      assert_equal("String Overrideable", description_dummy[:"x-rhino-attribute"][:readableName])
    end

    test "float greater than" do
      assert_type("float_gt", :float)
      assert_equal(2, @description[:minimum])
      assert @description[:exclusiveMinimum]
    end

    test "float greater than or equal to" do
      assert_type("float_gte", :float)
      assert_equal(2, @description[:minimum])
      assert_not @description[:exclusiveMinimum]
    end

    test "float less than" do
      assert_type("float_lt", :float)
      assert_equal(2, @description[:maximum])
      assert @description[:exclusiveMaximum]
    end

    test "float less than or equal to" do
      assert_type("float_lte", :float)
      assert_equal(2, @description[:maximum])
      assert_not @description[:exclusiveMaximum]
    end

    test "float in range" do
      assert_type("float_in", :float)
      assert_equal(2, @description[:minimum])
      assert_equal(5, @description[:maximum])
      assert_not @description[:exclusiveMinimum]
      assert_not @description[:exclusiveMaximum]
    end

    test "integer greater than" do
      assert_type("integer_gt", :integer)
      assert_equal(2, @description[:minimum])
      assert @description[:exclusiveMinimum]
    end

    test "integer greater than or equal to" do
      assert_type("integer_gte", :integer)
      assert_equal(2, @description[:minimum])
      assert_not @description[:exclusiveMinimum]
    end

    test "integer less than" do
      assert_type("integer_lt", :integer)
      assert_equal(2, @description[:maximum])
      assert @description[:exclusiveMaximum]
    end

    test "integer less than or equal to" do
      assert_type("integer_lte", :integer)
      assert_equal(2, @description[:maximum])
      assert_not @description[:exclusiveMaximum]
    end

    test "integer in range" do
      assert_type("integer_in", :integer)
      assert_equal(2, @description[:minimum])
      assert_equal(5, @description[:maximum])
      assert_not @description[:exclusiveMinimum]
      assert_not @description[:exclusiveMaximum]
    end

    test "float no nil" do
      assert_type("float_no_nil", :float)
      assert_not @description[:nullable]
    end

    test "integer no nil" do
      assert_type("integer_no_nil", :integer)
      assert_not @description[:nullable]
    end

    test "date required" do
      assert_type("date_required", "string")
      assert_not @description[:nullable]
    end

    test "datetime required" do
      assert_type("date_time_required", "string")
      assert_not @description[:nullable]
    end

    test "time required" do
      assert_type("time_required", "string")
      assert_not @description[:nullable]
    end

    test "array of integers" do
      assert_type("array_int", :array)
      assert_equal(:integer, @description[:items][:type])
      assert @description[:nullable]
    end

    test "enum" do
      assert_type("enum", :string)
      assert_equal(%w[test example], @description[:enum])
    end

    test "tags" do
      assert_type("tag_list", :array)
      assert_equal("string", @description[:items][:type])
      assert @description[:nullable]
    end

    test "belongs_to reference" do
      assert_type("user", :reference)
      assert_equal("#/components/schemas/user", @description[:anyOf].first[:$ref])
    end

    test "belongs_to polymorphic reference" do
      assert_type("polyable", :reference, model: Polymorphic)
      # FIXME This is incorrect but passing for now - should start failing if properties_describe is fixed
      assert_equal("#/components/schemas/polyable", @description[:anyOf].first[:$ref])
    end

    test "belongs_to reference with overridden class name" do
      assert_type("another_user", :reference)
      assert_equal("#/components/schemas/user", @description[:anyOf].first[:$ref])
    end

    test "has_many accepts nested reference" do
      assert_type("every_manies", :array)
      assert_equal("#/components/schemas/every_many", @description[:items][:anyOf].first[:$ref])
    end

    test "has_many no nested reference" do
      assert_type("every_manies_not_nested", :array)
      assert_equal("#/components/schemas/every_many", @description[:items][:anyOf].first[:$ref])
    end

    private
      def assert_type(property, type, model: EveryField)
        @description = model.describe_property(property)

        assert_equal(type, @description[:type])
      end
  end
end
