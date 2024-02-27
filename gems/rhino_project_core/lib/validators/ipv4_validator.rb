# frozen_string_literal: true

require "resolv"

class Ipv4Validator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    # https://gist.github.com/mozamimy/52c0004c8370f78df2c2
    record.errors.add(attribute, "not a valid IPv4 address") unless Resolv::IPv4::Regex.match?(value)
  end
end
