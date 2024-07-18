class CreateBlogPosts < ActiveRecord::Migration[7.0]
  def change
    create_table :blog_posts do |t|
      t.references :blog, null: false, foreign_key: true
      t.string :title
      t.text :body
      t.boolean :published

      t.timestamps
    end
  end
end
