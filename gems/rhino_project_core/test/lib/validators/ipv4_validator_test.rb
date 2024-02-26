# frozen_string_literal: true

require "test_helper"

class Ipv4ValidatorTest < ActiveSupport::TestCase
  class Ipv4
    include ActiveModel::Model
    include ActiveModel::Validations

    include Rhino::Resource

    attr_accessor :ipv4
  end

  test "validates ipv4" do
    class Ipv4Test < Ipv4
      validates :ipv4, ipv4: true
    end

    assert_predicate Ipv4Test.new, :invalid?
    assert_predicate Ipv4Test.new(ipv4: "12."), :invalid?
    assert_predicate Ipv4Test.new(ipv4: "192.168.1.1"), :valid?
  end

  test "validates ipv4 with allow_blank" do
    class Ipv4TestBlank < Ipv4
      validates :ipv4, ipv4: { allow_blank: true }
    end

    assert_predicate Ipv4TestBlank.new, :valid?
    assert_predicate Ipv4TestBlank.new(ipv4: "12."), :invalid?
    assert_predicate Ipv4TestBlank.new(ipv4: "192.168.1.1"), :valid?
  end
end
