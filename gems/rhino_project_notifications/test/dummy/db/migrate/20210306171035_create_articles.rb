class CreateArticles < ActiveRecord::Migration[6.0]
  def change
    create_table :articles do |t|
      t.references :user
      t.string :title
      t.text :body

      t.timestamps
    end
  end
end
