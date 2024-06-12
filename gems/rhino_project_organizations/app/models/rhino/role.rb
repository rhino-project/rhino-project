# frozen_string_literal: true

module Rhino
  class Role < ApplicationRecord
    self.abstract_class = true

    validates :name, presence: true, uniqueness: true, format: { with: /\A[a-zA-Z_]+\z/, message: "alpha characters only" }

    rhino_owner_global

    def display_name
      name.titleize
    end
  end
end
