# frozen_string_literal: true

class CreateResources < ActiveRecord::Migration[6.0]
  def change
    create_table :resources do |t|
      t.string :string_prop
      t.integer :integer_prop
      t.references :resource_parent, null: false, foreign_key: true

      t.timestamps
    end
  end
end
