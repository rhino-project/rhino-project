class AddUserToPolymorphic < ActiveRecord::Migration[7.1]
  def change
    add_reference :polymorphics, :user, null: false, foreign_key: true
  end
end
