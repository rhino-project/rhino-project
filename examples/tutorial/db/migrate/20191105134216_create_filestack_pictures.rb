class CreateFilestackPictures < ActiveRecord::Migration[5.2]
  def change
    create_table :filestack_pictures do |t|
      t.string :handle
      t.integer :width
      t.integer :height
      #t.references :picturable, polymorphic: true
      t.references :user

      t.timestamps
    end
  end
end
