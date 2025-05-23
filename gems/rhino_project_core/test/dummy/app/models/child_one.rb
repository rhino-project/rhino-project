# frozen_string_literal: true

class ChildOne < ApplicationRecord
  belongs_to :parent
  has_one :grand_child_one, dependent: :destroy

  rhino_owner :parent
  rhino_references %i[parent grand_child_one]

  accepts_nested_attributes_for :grand_child_one, allow_destroy: true
end
