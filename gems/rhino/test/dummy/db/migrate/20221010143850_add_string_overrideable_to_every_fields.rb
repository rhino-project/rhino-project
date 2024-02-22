class AddStringOverrideableToEveryFields < ActiveRecord::Migration[7.0]
  def change
    add_column :every_fields, :string_overrideable, :string
  end
end
