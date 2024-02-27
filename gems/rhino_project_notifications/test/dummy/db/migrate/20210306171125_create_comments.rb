class CreateComments < ActiveRecord::Migration[6.0]
  def change
    create_table :comments do |t|
      t.references :article
      t.references :user
      t.text :body

      t.timestamps
    end
  end
end
