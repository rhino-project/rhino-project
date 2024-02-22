class AddEnumToEveryFields < ActiveRecord::Migration[7.0]
  def change
    add_column :every_fields, :enum, :integer
  end
end
