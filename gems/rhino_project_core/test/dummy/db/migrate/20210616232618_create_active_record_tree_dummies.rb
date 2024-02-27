class CreateActiveRecordTreeDummies < ActiveRecord::Migration[6.1]
  def change
    create_table :active_record_tree_dummies do |t|
      t.string :ancestry

      t.timestamps
    end
    add_index :active_record_tree_dummies, :ancestry
  end
end
