class CreateEveryFieldDummies < ActiveRecord::Migration[7.0]
  def change
    create_table :every_field_dummies do |t|
      t.references :user, null: false, foreign_key: true
      t.string :string_overrideable
    end
  end
end
