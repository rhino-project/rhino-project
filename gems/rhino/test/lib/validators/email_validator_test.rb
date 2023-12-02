# frozen_string_literal: true

require "test_helper"

class EmailValidatorTest < ActiveSupport::TestCase
  class Email
    include ActiveModel::Model
    include ActiveModel::Validations

    include Rhino::Resource

    attr_accessor :email
  end

  test "validates email" do
    class EmailStandard < Email
      validates :email, email: true
    end

    assert_predicate EmailStandard.new, :invalid?
    assert_predicate EmailStandard.new(email: "test@"), :invalid?
    assert_predicate EmailStandard.new(email: "test@example.com"), :valid?
    assert_predicate EmailStandard.new(email: "example.com"), :invalid?
  end

  test "validates email with allow_blank" do
    class EmailBlank < Email
      validates :email, email: { allow_blank: true }
    end

    assert_predicate EmailBlank.new, :valid?
    assert_predicate EmailBlank.new(email: "test@"), :invalid?
    assert_predicate EmailBlank.new(email: "test@example.com"), :valid?
  end
end
