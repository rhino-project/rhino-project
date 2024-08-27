class CreatePolymorphics < ActiveRecord::Migration[7.1]
  def change
    create_table :polymorphics do |t|
      t.references :polyable, polymorphic: true, null: false

      t.timestamps
    end
  end
end
