class CreatePropertyLists < ActiveRecord::Migration[6.0]
  def change
    create_table :property_lists do |t|
      t.json :json_prop
      t.jsonb :jsonb_prop

      t.timestamps
    end
  end
end
