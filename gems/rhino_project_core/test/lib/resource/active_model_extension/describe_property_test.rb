# frozen_string_literal: true

require "test_helper"

module ActiveModelExtension
  class DescribePropertiesTest < ActiveSupport::TestCase
    class EveryFieldModel
      include Rhino::Resource::ActiveModelExtension
      include ActiveModel::Validations

      attribute :string_inclusion, :string
      attribute :string_length_min, :string
      attribute :string_length_max, :string
      attribute :string_length_range, :string
      attribute :string_length_exact, :string
      attribute :string_pattern, :string

      with_options allow_blank: true do
        validates :string_inclusion, inclusion: { in: %w[test example] }
        validates :string_length_min, length: { minimum: 2 }
        validates :string_length_max, length: { maximum: 5 }
        validates :string_length_range, length: { in: 2..5 }
        validates :string_length_exact, length: { is: 2 }
        validates :string_pattern, format: { with: /\A[Tt][a-zA-Z]+\z/ }
      end

      attribute :float_gt, :float
      attribute :float_gte, :float
      attribute :float_lt, :float
      attribute :float_lte, :float
      attribute :float_in, :float

      attribute :integer_gt, :integer
      attribute :integer_gte, :integer
      attribute :integer_lt, :integer
      attribute :integer_lte, :integer
      attribute :integer_in, :integer

      with_options allow_nil: true do
        validates :float_gt, numericality: { greater_than: 2 }
        validates :float_gte, numericality: { greater_than_or_equal_to: 2 }
        validates :float_lt, numericality: { less_than: 2 }
        validates :float_lte, numericality: { less_than_or_equal_to: 2 }
        validates :float_in, numericality: { in: 2..5 }

        validates :integer_gt, numericality: { only_integer: true, greater_than: 2 }
        validates :integer_gte, numericality: { only_integer: true, greater_than_or_equal_to: 2 }
        validates :integer_lt, numericality: { only_integer: true, less_than: 2 }
        validates :integer_lte, numericality: { only_integer: true, less_than_or_equal_to: 2 }
        validates :integer_in, numericality: { in: 2..5 }
      end

      attribute :float_no_nil, :float
      attribute :integer_no_nil, :integer

      validates :float_no_nil, numericality: true
      validates :integer_no_nil, numericality: { only_integer: true }
    end

    test "string inclusion" do
      description = EveryFieldModel.describe_property("string_inclusion")
      assert_equal(:string, description[:type])
      assert_equal(%w[test example], description[:enum])
    end

    test "string length minimum" do
      description = EveryFieldModel.describe_property("string_length_min")
      assert_equal(:string, description[:type])
      assert_equal(2, description[:minLength])
    end

    test "string length maximum" do
      description = EveryFieldModel.describe_property("string_length_max")
      assert_equal(:string, description[:type])
      assert_equal(5, description[:maxLength])
    end

    test "string length range" do
      description = EveryFieldModel.describe_property("string_length_range")
      assert_equal(:string, description[:type])
      assert_equal(2, description[:minLength])
      assert_equal(5, description[:maxLength])
    end

    test "string length exact" do
      description = EveryFieldModel.describe_property("string_length_exact")
      assert_equal(:string, description[:type])
      assert_equal(2, description[:minLength])
      assert_equal(2, description[:maxLength])
    end

    test "string pattern" do
      description = EveryFieldModel.describe_property("string_pattern")
      assert_equal(:string, description[:type])
      assert_equal("^[Tt][a-zA-Z]+$", description[:pattern])
    end

    test "float greater than" do
      description = EveryFieldModel.describe_property("float_gt")
      assert_equal(:float, description[:type])
      assert_equal(2, description[:minimum])
      assert description[:exclusiveMinimum]
    end

    test "float greater than or equal to" do
      description = EveryFieldModel.describe_property("float_gte")
      assert_equal(:float, description[:type])
      assert_equal(2, description[:minimum])
      assert_not description[:exclusiveMinimum]
    end

    test "float less than" do
      description = EveryFieldModel.describe_property("float_lt")
      assert_equal(:float, description[:type])
      assert_equal(2, description[:maximum])
      assert description[:exclusiveMaximum]
    end

    test "float less than or equal to" do
      description = EveryFieldModel.describe_property("float_lte")
      assert_equal(:float, description[:type])
      assert_equal(2, description[:maximum])
      assert_not description[:exclusiveMaximum]
    end

    test "float in range" do
      description = EveryFieldModel.describe_property("float_in")
      assert_equal(:float, description[:type])
      assert_equal(2, description[:minimum])
      assert_equal(5, description[:maximum])
      assert_not description[:exclusiveMinimum]
      assert_not description[:exclusiveMaximum]
    end

    test "integer greater than" do
      description = EveryFieldModel.describe_property("integer_gt")
      assert_equal(:integer, description[:type])
      assert_equal(2, description[:minimum])
      assert description[:exclusiveMinimum]
    end

    test "integer greater than or equal to" do
      description = EveryFieldModel.describe_property("integer_gte")
      assert_equal(:integer, description[:type])
      assert_equal(2, description[:minimum])
      assert_not description[:exclusiveMinimum]
    end

    test "integer less than" do
      description = EveryFieldModel.describe_property("integer_lt")
      assert_equal(:integer, description[:type])
      assert_equal(2, description[:maximum])
      assert description[:exclusiveMaximum]
    end

    test "integer less than or equal to" do
      description = EveryFieldModel.describe_property("integer_lte")
      assert_equal(:integer, description[:type])
      assert_equal(2, description[:maximum])
      assert_not description[:exclusiveMaximum]
    end

    test "integer in range" do
      description = EveryFieldModel.describe_property("integer_in")
      assert_equal(:integer, description[:type])
      assert_equal(2, description[:minimum])
      assert_equal(5, description[:maximum])
      assert_not description[:exclusiveMinimum]
      assert_not description[:exclusiveMaximum]
    end

    test "float no nil" do
      description = EveryFieldModel.describe_property("float_no_nil")
      assert_equal(:float, description[:type])
      assert_not description[:nullable]
    end

    test "integer no nil" do
      description = EveryFieldModel.describe_property("integer_no_nil")
      assert_equal(:integer, description[:type])
      assert_not description[:nullable]
    end
  end
end
