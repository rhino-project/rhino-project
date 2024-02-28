class CreateUsersRoleInvite < ActiveRecord::Migration[6.1]
  def change
    create_table :users_role_invites do |t|
      t.string :email, null: false
      t.references :organization, null: false, foreign_key: true
      t.references :role, null: false, foreign_key: true

      t.timestamps
    end
  end
end
