class CreateDelegatedTypeComments < ActiveRecord::Migration[7.0]
  def change
    create_table :delegated_type_comments do |t|
      t.string :subject
      t.string :body
      t.string :content

      t.timestamps
    end
  end
end
