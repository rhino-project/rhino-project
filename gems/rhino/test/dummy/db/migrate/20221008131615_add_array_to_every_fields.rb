class AddArrayToEveryFields < ActiveRecord::Migration[7.0]
  def change
    add_column :every_fields, :array_int, :integer, array: true
  end
end
