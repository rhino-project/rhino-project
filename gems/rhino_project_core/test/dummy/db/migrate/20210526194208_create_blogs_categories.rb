class CreateBlogsCategories < ActiveRecord::Migration[6.1]
  def change
    create_table :blogs_categories do |t|
      t.references :blog, foreign_key: true
      t.references :category, foreign_key: true

      t.timestamps
    end

    remove_reference :blogs, :category
  end
end
