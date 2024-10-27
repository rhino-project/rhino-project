class CreateNamespaceNamespacedManies < ActiveRecord::Migration[7.1]
  def change
    create_table :namespace_namespaced_manies do |t|
      t.references :parent, null: false, foreign_key: true
      t.string :name

      t.timestamps
    end
  end
end
