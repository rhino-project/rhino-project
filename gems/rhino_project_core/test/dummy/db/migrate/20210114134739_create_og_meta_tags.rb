class CreateOgMetaTags < ActiveRecord::Migration[6.0]
  def change
    create_table :og_meta_tags do |t|
      t.references :blog_post, null: false, foreign_key: true
      t.string :tag_name
      t.string :value

      t.timestamps
    end
  end
end
