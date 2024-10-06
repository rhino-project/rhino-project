class Blog < ApplicationRecord
  belongs_to :user
  belongs_to :category
  has_many :blog_posts, dependent: :destroy

  # Rhino specific code
  rhino_owner_base
  rhino_references [:user, :category]

  validates :title, presence: true
end
