class AddVirtualFloatToEveryField < ActiveRecord::Migration[7.0]
  def change
    add_column :every_fields, :float_virtual, :float, as: 'float_no_nil / 2', stored: true, virtual: true
  end
end
