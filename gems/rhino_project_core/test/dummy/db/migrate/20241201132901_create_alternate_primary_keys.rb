class CreateAlternatePrimaryKeys < ActiveRecord::Migration[7.2]
  def change
    create_table :alternate_primary_keys, primary_key: :non_standard_primary_key do |t|
      t.string :name
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
