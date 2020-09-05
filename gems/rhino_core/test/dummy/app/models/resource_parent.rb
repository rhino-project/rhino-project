# frozen_string_literal: true

class ResourceParent < ApplicationRecord
  has_many :resources

  rhino_owner_base
end
