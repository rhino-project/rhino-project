class BlogsCategory < ApplicationRecord
  belongs_to :blog
  belongs_to :category

  rhino_owner :blog
  rhino_references %i[blog category]

  validates :category, uniqueness: { scope: :blog }

  def display_name
    category.display_name
  end
end
