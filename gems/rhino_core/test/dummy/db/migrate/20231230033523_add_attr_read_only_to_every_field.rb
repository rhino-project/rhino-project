class AddAttrReadOnlyToEveryField < ActiveRecord::Migration[7.0]
  def change
    add_column :every_fields, :string_readonly, :string
  end
end
