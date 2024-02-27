class CreateEveryFields < ActiveRecord::Migration[6.1]
  def change
    create_table :every_fields do |t|
      t.references :user, null: false, foreign_key: true

      t.string :string
      t.string :string_length_min
      t.string :string_length_max
      t.string :string_length_range
      t.string :string_length_exact
      t.string :string_inclusion
      t.string :string_pattern

      t.float :float_gt
      t.float :float_gte
      t.float :float_lt
      t.float :float_lte
      t.float :float_in
      t.float :float_no_nil

      t.integer :integer_gt
      t.integer :integer_gte
      t.integer :integer_lt
      t.integer :integer_lte
      t.integer :integer_in
      t.integer :integer_no_nil

      t.date :date
      t.date :date_required

      t.datetime :date_time
      t.datetime :date_time_required

      t.time :time
      t.time :time_required

      t.integer :year

      t.timestamps
    end
  end
end
