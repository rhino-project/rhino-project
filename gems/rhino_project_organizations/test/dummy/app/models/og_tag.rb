# frozen_string_literal: true

class OgTag < ApplicationRecord
  has_many :og_meta_tags, dependent: :destroy

  rhino_owner_global

  validates :name, presence: true
end
