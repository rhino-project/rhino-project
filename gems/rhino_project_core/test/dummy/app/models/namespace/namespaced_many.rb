# frozen_string_literal: true

class Namespace::NamespacedMany < ApplicationRecord
  belongs_to :parent

  rhino_owner :parent
  rhino_property_canonical :name
  rhino_references [:parent]
end
