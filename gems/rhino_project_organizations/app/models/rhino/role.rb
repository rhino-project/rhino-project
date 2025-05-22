# frozen_string_literal: true

module Rhino
  class Role < ApplicationRecord
    attribute :display_name, :string, default: -> { name.titleize }

    self.abstract_class = true

    validates :name, presence: true, uniqueness: true, format: { with: /\A[a-zA-Z_]+\z/, message: "alpha characters only" }

    rhino_owner_global
    rhino_property_canonical :display_name, order: :name
  end
end
