# frozen_string_literal: true

require "test_helper"

class CountryValidatorTest < ActiveSupport::TestCase
  class Country
    include ActiveModel::Model
    include ActiveModel::Validations

    include Rhino::Resource

    attr_accessor :country
  end

  test "validates alpha2 country" do
    class CountryAlpha2 < Country
      validates :country, country: true
    end

    assert_predicate CountryAlpha2.new, :invalid?
    assert_predicate CountryAlpha2.new(country: "ZZ"), :invalid?
    assert_predicate CountryAlpha2.new(country: "CA"), :valid?
    assert_predicate CountryAlpha2.new(country: "CAN"), :invalid?
  end

  test "validates alpha2 country with allow_blank" do
    class CountryAlpha2 < Country
      validates :country, country: { allow_blank: true }
    end

    assert_predicate CountryAlpha2.new, :valid?
    assert_predicate CountryAlpha2.new(country: "ZZ"), :invalid?
    assert_predicate CountryAlpha2.new(country: "CA"), :valid?
  end

  test "validates alpha3 country" do
    class CountryAlpha3 < Country
      validates :country, country: { alpha3: true }
    end

    assert_predicate CountryAlpha3.new, :invalid?
    assert_predicate CountryAlpha3.new(country: "ZZZ"), :invalid?
    assert_predicate CountryAlpha3.new(country: "CAN"), :valid?
    assert_predicate CountryAlpha3.new(country: "CA"), :invalid?
  end

  test "validates alpha3 country with allow_blank" do
    class CountryAlpha3 < Country
      validates :country, country: { alpha3: true, allow_blank: true }
    end

    assert_predicate CountryAlpha3.new, :valid?
    assert_predicate CountryAlpha3.new(country: "ZZZ"), :invalid?
    assert_predicate CountryAlpha3.new(country: "CAN"), :valid?
    assert_predicate CountryAlpha3.new(country: "CA"), :invalid?
  end
end
