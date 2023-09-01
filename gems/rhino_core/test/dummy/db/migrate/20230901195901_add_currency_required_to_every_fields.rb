# frozen_string_literal: true

class AddCurrencyRequiredToEveryFields < ActiveRecord::Migration[7.0]
  def up
    add_column :every_fields, :currency_required, :decimal, precision: 10, scale: 4, null: false
    move_down_other_columns
  end

  def down
    remove_column :every_fields, :currency_required
  end

  private

  # This method moves all columns after "currency" down one step just so we can have
  # "currency" and "currency_required" next to each other in the UI, like it is done
  # for the other attributes (e.g. int, float, date, datetime).
  # Although not really necessary, it makes the visualization and testing of the fields easier
  # when they're grouped together by type.
  # Steps:
  # 1. create a new column named [old_column]_dup. Example: array_int_dup, enum_dup, etc.
  # 2. update the new column with the value from the old column
  # 3. delete the old column
  # 4. rename the new column with the old column name
  def move_down_other_columns
    {
      array_int: [:integer, {array: true}],
      enum: [:integer],
      string_write_only: [:string],
      string_overrideable: [:string],
      phone: [:string]
    }.each do |column_name, (type, properties)|
      move_down_column(column_name, type, **(properties || {}))
    end
  end

  def move_down_column(column_name, type, **properties)
    new_column_name = "#{column_name}_dup"
    add_column :every_fields, new_column_name.to_sym, type, **properties

    update <<~SQL.squish
      UPDATE every_fields SET #{new_column_name}=#{column_name};
    SQL

    remove_column :every_fields, column_name
    rename_column :every_fields, new_column_name, column_name
  end
end
