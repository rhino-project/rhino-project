class AddUniqueIndexToBlogsCategory < ActiveRecord::Migration[6.1]
  def change
    add_index(:blogs_categories, [:blog_id, :category_id], unique: true)
  end
end
