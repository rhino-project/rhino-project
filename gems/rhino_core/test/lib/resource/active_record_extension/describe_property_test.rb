# frozen_string_literal: true

require "test_helper"

module ActiveRecordExtension
  class DescribePropertiesTest < ActiveSupport::TestCase # rubocop:todo Metrics/ClassLength
    test "string inclusion" do
      description = EveryField.describe_property("string_inclusion")
      assert_equal(:string, description[:type])
      assert_equal(%w[test example], description[:enum])
    end

    test "string length minimum" do
      description = EveryField.describe_property("string_length_min")
      assert_equal(:string, description[:type])
      assert_equal(2, description[:minLength])
    end

    test "string length maximum" do
      description = EveryField.describe_property("string_length_max")
      assert_equal(:string, description[:type])
      assert_equal(5, description[:maxLength])
    end

    test "string length range" do
      description = EveryField.describe_property("string_length_range")
      assert_equal(:string, description[:type])
      assert_equal(2, description[:minLength])
      assert_equal(5, description[:maxLength])
    end

    test "string length exact" do
      description = EveryField.describe_property("string_length_exact")
      assert_equal(:string, description[:type])
      assert_equal(2, description[:minLength])
      assert_equal(2, description[:maxLength])
    end

    test "string pattern" do
      description = EveryField.describe_property("string_pattern")
      assert_equal(:string, description[:type])
      assert_equal("^[Tt][a-zA-Z]+$", description[:pattern])
    end

    test "float greater than" do
      description = EveryField.describe_property("float_gt")
      assert_equal(:float, description[:type])
      assert_equal(2, description[:minimum])
      assert description[:exclusiveMinimum]
    end

    test "float greater than or equal to" do
      description = EveryField.describe_property("float_gte")
      assert_equal(:float, description[:type])
      assert_equal(2, description[:minimum])
      assert_not description[:exclusiveMinimum]
    end

    test "float less than" do
      description = EveryField.describe_property("float_lt")
      assert_equal(:float, description[:type])
      assert_equal(2, description[:maximum])
      assert description[:exclusiveMaximum]
    end

    test "float less than or equal to" do
      description = EveryField.describe_property("float_lte")
      assert_equal(:float, description[:type])
      assert_equal(2, description[:maximum])
      assert_not description[:exclusiveMaximum]
    end

    test "float in range" do
      description = EveryField.describe_property("float_in")
      assert_equal(:float, description[:type])
      assert_equal(2, description[:minimum])
      assert_equal(5, description[:maximum])
      assert_not description[:exclusiveMinimum]
      assert_not description[:exclusiveMaximum]
    end

    test "integer greater than" do
      description = EveryField.describe_property("integer_gt")
      assert_equal(:integer, description[:type])
      assert_equal(2, description[:minimum])
      assert description[:exclusiveMinimum]
    end

    test "integer greater than or equal to" do
      description = EveryField.describe_property("integer_gte")
      assert_equal(:integer, description[:type])
      assert_equal(2, description[:minimum])
      assert_not description[:exclusiveMinimum]
    end

    test "integer less than" do
      description = EveryField.describe_property("integer_lt")
      assert_equal(:integer, description[:type])
      assert_equal(2, description[:maximum])
      assert description[:exclusiveMaximum]
    end

    test "integer less than or equal to" do
      description = EveryField.describe_property("integer_lte")
      assert_equal(:integer, description[:type])
      assert_equal(2, description[:maximum])
      assert_not description[:exclusiveMaximum]
    end

    test "integer in range" do
      description = EveryField.describe_property("integer_in")
      assert_equal(:integer, description[:type])
      assert_equal(2, description[:minimum])
      assert_equal(5, description[:maximum])
      assert_not description[:exclusiveMinimum]
      assert_not description[:exclusiveMaximum]
    end

    test "float no nil" do
      description = EveryField.describe_property("float_no_nil")
      assert_equal(:float, description[:type])
      assert_not description[:nullable]
    end

    test "integer no nil" do
      description = EveryField.describe_property("integer_no_nil")
      assert_equal(:integer, description[:type])
      assert_not description[:nullable]
    end

    test "date required" do
      description = EveryField.describe_property("date_required")
      assert_equal("string", description[:type])
      assert_not description[:nullable]
    end

    test "datetime required" do
      description = EveryField.describe_property("date_time_required")
      assert_equal("string", description[:type])
      assert_not description[:nullable]
    end

    test "time required" do
      description = EveryField.describe_property("time_required")
      assert_equal("string", description[:type])
      assert_not description[:nullable]
    end

    test "array of integers" do
      description = EveryField.describe_property("array_int")
      assert_equal(:array, description[:type])
      assert_equal(:integer, description[:items][:type])
      assert description[:nullable]
    end
  end
end
