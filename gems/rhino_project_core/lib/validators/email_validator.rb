# frozen_string_literal: true

class EmailValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    # https://stackoverflow.com/questions/38611405/email-validation-in-ruby-on-rails
    record.errors.add(attribute, "must be a valid email address") unless value&.match?(Devise.email_regexp)
  end
end
