class AddCurrencyToEveryFields < ActiveRecord::Migration[7.0]
  def change
    add_column :every_fields, :currency, :decimal, precision: 10, scale: 4
  end
end
