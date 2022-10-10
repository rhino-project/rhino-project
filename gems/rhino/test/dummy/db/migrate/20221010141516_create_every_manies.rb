class CreateEveryManies < ActiveRecord::Migration[7.0]
  def change
    create_table :every_manies do |t|
      t.references :every_field, null: false, foreign_key: true

      t.timestamps
    end
  end
end
