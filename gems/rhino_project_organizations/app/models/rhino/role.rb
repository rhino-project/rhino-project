# frozen_string_literal: true

module Rhino
  class Role < ApplicationRecord
    attribute :title, :string

    self.abstract_class = true

    validates :name, presence: true, uniqueness: true, format: { with: /\A[a-zA-Z_]+\z/, message: "alpha characters only" }

    rhino_owner_global
    rhino_property_canonical :title, order: :name
    rhino_properties_write except: :title

    def title
      name.titleize
    end
  end
end
