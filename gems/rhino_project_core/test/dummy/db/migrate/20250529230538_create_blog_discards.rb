class CreateBlogDiscards < ActiveRecord::Migration[8.0]
  def change
    create_table :blog_discards do |t|
      t.string :title
      t.references :user, null: false, foreign_key: true
      t.datetime :discarded_at

      t.timestamps
    end
  end
end
