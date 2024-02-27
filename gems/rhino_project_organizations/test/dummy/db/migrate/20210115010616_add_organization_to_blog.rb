class AddOrganizationToBlog < ActiveRecord::Migration[6.0]
  def change
    add_reference :blogs, :organization, null: false, foreign_key: true
  end
end
