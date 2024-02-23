class CreateDummies < ActiveRecord::Migration[6.1]
  def change
    create_table :dummies do |t|
      t.string :field

      t.timestamps
    end
  end
end
