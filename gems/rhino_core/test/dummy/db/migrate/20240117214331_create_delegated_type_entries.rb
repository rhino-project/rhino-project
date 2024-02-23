class CreateDelegatedTypeEntries < ActiveRecord::Migration[7.0]
  def change
    create_table :delegated_type_entries do |t|
      t.string :entryable_type
      t.integer :entryable_id
      t.references :user, null: false, foreign_key: true
      t.string :string_field

      t.timestamps
    end
  end
end
