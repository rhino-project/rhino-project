# frozen_string_literal: true

class Resource < ApplicationRecord
  belongs_to :resource_parent
  has_many :resource_children

  accepts_nested_attributes_for :resource_children

  rhino_owner :resource_parent
  rhino_references %i[resource_parent resource_children]
end
