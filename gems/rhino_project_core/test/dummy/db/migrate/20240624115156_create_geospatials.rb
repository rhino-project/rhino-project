class CreateGeospatials < ActiveRecord::Migration[7.0]
  def change
    create_table :geospatials do |t|
      t.references :user, null: false, foreign_key: true
      t.decimal :latitude
      t.decimal :longitude

      t.timestamps
    end
  end
end
