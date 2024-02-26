class AddStringWriteOnlyToEveryFields < ActiveRecord::Migration[7.0]
  def change
    add_column :every_fields, :string_write_only, :string
  end
end
