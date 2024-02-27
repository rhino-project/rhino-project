class CreateDelegatedTypeMessages < ActiveRecord::Migration[7.0]
  def change
    create_table :delegated_type_messages do |t|
      t.string :subject
      t.string :body

      t.timestamps
    end
  end
end
