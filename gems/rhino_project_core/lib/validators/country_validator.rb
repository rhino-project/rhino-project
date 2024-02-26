# frozen_string_literal: true

class CountryValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    if options[:alpha3]
      record.errors.add(attribute, "must be 3 characters (ISO 3166-1).") unless ISO3166::Country.find_country_by_alpha3(value)
    else
      record.errors.add(attribute, "must be 2 characters (ISO 3166-1).") unless ISO3166::Country[value]
    end
  end
end
