# frozen_string_literal: true

class CreateResourceChildren < ActiveRecord::Migration[6.0]
  def change
    create_table :resource_children do |t|
      t.string :string_prop
      t.references :resource, null: false, foreign_key: true

      t.timestamps
    end
  end
end
