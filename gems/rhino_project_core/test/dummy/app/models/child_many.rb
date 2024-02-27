# frozen_string_literal: true

class ChildMany < ApplicationRecord
  belongs_to :parent
  has_many :grand_child_manies, dependent: :destroy

  rhino_owner :parent
  rhino_references %i[parent grand_child_manies]

  accepts_nested_attributes_for :grand_child_manies, allow_destroy: true
end
