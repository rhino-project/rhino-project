class AddCountryToBlog < ActiveRecord::Migration[6.1]
  def change
    add_column :blogs, :country, :string, limit: 2
  end
end
