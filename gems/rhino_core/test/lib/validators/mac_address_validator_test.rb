# frozen_string_literal: true

require "test_helper"

class MacAddressValidatorTest < ActiveSupport::TestCase
  class MacAddress
    include ActiveModel::Model
    include ActiveModel::Validations

    include Rhino::Resource

    attr_accessor :mac_address
  end

  test "validates mac address" do
    class MacAddressTest < MacAddress
      validates :mac_address, mac_address: true
    end

    assert_predicate MacAddressTest.new, :invalid?
    assert_predicate MacAddressTest.new(mac_address: "7Z:00:18:ce:16:30"), :invalid?
    assert_predicate MacAddressTest.new(mac_address: "7b:00:18:ce:16:30"), :valid?
  end

  test "validates mac address with allow_blank" do
    class MacAddressTestBlank < MacAddress
      validates :mac_address, mac_address: { allow_blank: true }
    end

    assert_predicate MacAddressTestBlank.new, :valid?
    assert_predicate MacAddressTestBlank.new(mac_address: "7Z:00:18:ce:16:30"), :invalid?
    assert_predicate MacAddressTestBlank.new(mac_address: "7b:00:18:ce:16:30"), :valid?
  end
end
