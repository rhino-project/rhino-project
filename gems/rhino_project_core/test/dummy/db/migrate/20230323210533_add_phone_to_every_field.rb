class AddPhoneToEveryField < ActiveRecord::Migration[7.0]
  def change
    add_column :every_fields, :phone, :string
  end
end
