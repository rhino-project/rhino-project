# frozen_string_literal: true

class AddMissingRequiredCounterpartsToEveryFields < ActiveRecord::Migration[7.0]
  def up
    add_year_required
    add_enum_required
  end

  def down
    remove_column :every_fields, :year_required
    remove_column :every_fields, :enum_required
  end

  private

  def add_year_required
    add_column :every_fields, :year_required, :integer, null: false

    # Move down all columns after "year" so "year" and "year_required" will be next
    # to each other
    move_down_column(:created_at, :datetime, null: false)
    move_down_column(:updated_at, :datetime, null: false)
    move_down_column(:currency, :decimal, precision: 10, scale: 4)
    move_down_column(:currency_required, :decimal, precision: 10, scale: 4, null: false)
    move_down_column(:array_int, :integer, array: true)
    move_down_column(:enum, :integer)
  end

  def add_enum_required
    add_column :every_fields, :enum_required, :integer, null: false

    # Move down all columns after "enum" so "enum" and "enum_required" will be next
    # to each other
    move_down_column(:string_write_only, :string)
    move_down_column(:string_overrideable, :string)
    move_down_column(:phone, :string)
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
