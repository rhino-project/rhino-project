class Category < ApplicationRecord
  has_many :blogs, dependent: :destroy

  # Rhino specific code
  rhino_owner_global

  validates :name, presence: true
end
