# frozen_string_literal: true

class Category < ApplicationRecord
  has_many :blogs, dependent: :nullify

  rhino_owner_global
  rhino_property_canonical :name
  rhino_sieves.swap Rhino::Sieve::Limit, Rhino::Sieve::Limit, default_limit: nil
  rhino_search [:name]
end
