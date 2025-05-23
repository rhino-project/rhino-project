# frozen_string_literal: true

require "test_helper"

module Rhino
  module Resource
    class CanonicalPropertyTest < ActiveSupport::TestCase
      class TestModel < ApplicationRecord
        self.table_name = "dummies"
      end

      class TestModelWithName < TestModel
        attribute :name, :string

        def name
          "test name"
        end
      end

      class TestModelWithTitle < TestModel
        attribute :title, :string

        def title
          "test title"
        end
      end

      class TestModelWithCanonical < TestModel
        attribute :custom_field, :string

        rhino_property_canonical :custom_field

        def custom_field
          "test custom"
        end
      end

      class TestModelWithCanonicalAndOrder < TestModel
        attribute :custom_field, :string
        attribute :other_field, :string

        rhino_property_canonical :custom_field, order: :other_field

        def custom_field
          "test custom"
        end

        def other_field
          "test other"
        end
      end

      class TestModelWithInheritance < TestModelWithCanonical
      end

      test "returns identifier property when no fallbacks available" do
        assert_equal TestModel.identifier_property, TestModel.canonical_property
      end

      test "uses name as fallback" do
        assert_equal "name", TestModelWithName.canonical_property
      end

      test "uses title as fallback when name not available" do
        assert_equal "title", TestModelWithTitle.canonical_property
      end

      test "uses explicitly set canonical property" do
        assert_equal "custom_field", TestModelWithCanonical.canonical_property
      end

      test "inherits canonical property from parent" do
        assert_equal "custom_field", TestModelWithInheritance.canonical_property
      end

      test "can be accessed from instance" do
        model = TestModelWithCanonical.new
        assert_equal "custom_field", model.canonical_property
      end

      test "can be accessed from inherited instance" do
        model = TestModelWithInheritance.new
        assert_equal "custom_field", model.canonical_property
      end

      test "can be accessed from instance with fallback" do
        model = TestModelWithName.new
        assert_equal "name", model.canonical_property
      end

      test "canonical_order defaults to canonical_property" do
        assert_equal "custom_field", TestModelWithCanonical.canonical_order
      end

      test "canonical_order can be set to a different value" do
        assert_equal "other_field", TestModelWithCanonicalAndOrder.canonical_order
      end

      test "canonical_order can be accessed from instance" do
        model = TestModelWithCanonicalAndOrder.new
        assert_equal "other_field", model.canonical_order
      end

      test "canonical_order inherits from parent" do
        model = TestModelWithInheritance.new
        assert_equal "custom_field", model.canonical_order
      end
    end
  end
end
