# frozen_string_literal: true

class Polymorphic < ApplicationRecord
  belongs_to :user
  belongs_to :polyable, polymorphic: true

  rhino_owner_base
  rhino_property_canonical :id
  rhino_references %i[polyable]
end
