# frozen_string_literal: true

class CreatePropertyResources < ActiveRecord::Migration[6.0]
  def change
    create_table :property_resources do |t|
      t.string :prop_one
      t.string :prop_two
      t.string :prop_three
      t.string :prop_four
      t.string :prop_five
      t.string :prop_six

      t.timestamps
    end
  end
end
