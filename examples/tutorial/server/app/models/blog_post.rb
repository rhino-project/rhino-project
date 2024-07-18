class BlogPost < ApplicationRecord
  belongs_to :blog

  # Rhino specific code
  rhino_owner :blog
  rhino_references [:blog]

  validates :title, presence: true
  validates :body, presence: true
end
