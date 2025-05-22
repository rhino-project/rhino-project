# frozen_string_literal: true

class Parent < ApplicationRecord
  belongs_to :user
  has_one :child_one, dependent: :destroy
  has_many :child_manies, dependent: :destroy
  has_many :namespaced_manies, class_name: "Namespace::NamespacedMany", dependent: :destroy

  rhino_owner_base
  rhino_property_canonical :name
  rhino_references [:user, { child_one: [:grand_child_one] }, { child_manies: [:grand_child_manies] }, :namespaced_manies]

  accepts_nested_attributes_for :child_one, allow_destroy: true
  accepts_nested_attributes_for :child_manies, allow_destroy: true
  accepts_nested_attributes_for :namespaced_manies, allow_destroy: true
end
