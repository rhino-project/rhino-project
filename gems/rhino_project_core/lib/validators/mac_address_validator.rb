# frozen_string_literal: true

require "resolv"

class MacAddressValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    record.errors.add(attribute, "not a valid Mac address") unless /\A([0-9A-Fa-f]{2}[-:]){5}([0-9A-Fa-f]{2})\z/.match?(value)
  end
end
