# frozen_string_literal: true

require "test_helper"

module ActiveRecord
  class DelegatedTypeTest < ActiveSupport::TestCase
    test "allow introspection of supported types" do
      assert_equal %w[DelegatedTypeMessage DelegatedTypeComment], DelegatedTypeEntry.entryable_types
    end
  end
end
