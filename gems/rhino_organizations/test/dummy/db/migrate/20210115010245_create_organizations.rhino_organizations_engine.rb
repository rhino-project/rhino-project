# This migration comes from rhino_organizations_engine (originally 20201129221747)
class CreateOrganizations < ActiveRecord::Migration[6.0]
  def change
    create_table :organizations do |t|
      t.string :name

      t.timestamps
    end

    create_table :roles do |t|
      t.string :name, null: false

      t.timestamps
    end

    create_table :users_roles do |t|
      t.references :user, null: false, foreign_key: true
      t.references :organization, null: false, foreign_key: true
      t.references :role, null: false, foreign_key: true

      t.timestamps
    end
  end
end
