# frozen_string_literal: true

class EveryMany < ApplicationRecord
  belongs_to :every_field
  belongs_to :every_field_not_nested, class_name: "EveryField", foreign_key: :every_field_id, inverse_of: :every_manies_not_nested

  rhino_owner :every_field
  rhino_references %i[every_field every_field_not_nested]
end
