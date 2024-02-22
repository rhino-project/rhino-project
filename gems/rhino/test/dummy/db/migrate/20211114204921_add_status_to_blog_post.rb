class AddStatusToBlogPost < ActiveRecord::Migration[6.1]
  def change
    add_column :blog_posts, :status, :integer, default: 0
  end
end
