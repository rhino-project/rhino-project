class CreateGrandChildOnes < ActiveRecord::Migration[7.0]
  def change
    create_table :grand_child_ones do |t|
      t.references :child_one, null: false, foreign_key: true
      t.string :name

      t.timestamps
    end
  end
end
