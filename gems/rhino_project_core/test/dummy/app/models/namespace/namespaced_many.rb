# frozen_string_literal: true

class Namespace::NamespacedMany < ApplicationRecord
  belongs_to :parent

  rhino_owner :parent
  rhino_references [:parent]
end
