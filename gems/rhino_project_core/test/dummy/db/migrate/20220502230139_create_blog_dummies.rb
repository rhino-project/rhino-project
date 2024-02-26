class CreateBlogDummies < ActiveRecord::Migration[6.1]
  def change
    create_table :blog_dummies do |t|
      t.string :name
      t.references :blog, null: true, foreign_key: true

      t.timestamps
    end
  end
end
