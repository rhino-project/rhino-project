# frozen_string_literal: true

module Rhino
  class Role < ApplicationRecord
    self.abstract_class = true

    validates :name, presence: true, uniqueness: true, format: { with: /\A[a-zA-Z]+\z/, message: "alpha characters only" }

    rhino_owner_global
  end
end
