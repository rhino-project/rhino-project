class CreateGrandChildManies < ActiveRecord::Migration[7.0]
  def change
    create_table :grand_child_manies do |t|
      t.references :child_many, null: false, foreign_key: true
      t.string :name

      t.timestamps
    end
  end
end
