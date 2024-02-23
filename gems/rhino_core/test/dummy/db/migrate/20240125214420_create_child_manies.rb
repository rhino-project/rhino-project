class CreateChildManies < ActiveRecord::Migration[7.0]
  def change
    create_table :child_manies do |t|
      t.references :parent, null: false, foreign_key: true
      t.string :name

      t.timestamps
    end
  end
end
