# frozen_string_literal: true

class Category < ApplicationRecord
  has_many :blogs_categories, dependent: :nullify
  has_many :blogs, through: :blogs_categories

  rhino_owner_global
  rhino_sieves.swap Rhino::Sieve::Limit, Rhino::Sieve::Limit, default_limit: nil
  rhino_search [:name]
end
