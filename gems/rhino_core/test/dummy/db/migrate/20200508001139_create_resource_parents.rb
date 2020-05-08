# frozen_string_literal: true

class CreateResourceParents < ActiveRecord::Migration[6.0]
  def change
    create_table :resource_parents do |t|
      t.string :string_prop
      t.integer :integer_prop

      t.timestamps
    end
  end
end
