class CreateOgTags < ActiveRecord::Migration[6.0]
  def change
    create_table :og_tags do |t|
      t.string :name, null: false

      t.timestamps
    end

    add_reference :og_meta_tags, :og_tag, foreign_key: true
    remove_column :og_meta_tags, :tag_name, type: :string
  end
end
