class AddCategoryToBlogs < ActiveRecord::Migration[6.0]
  def change
    add_reference :blogs, :category, null: true, foreign_key: true
  end
end
