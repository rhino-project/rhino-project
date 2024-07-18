# frozen_string_literal: true
# This migration comes from rhino_engine (originally 20191217010224)

class AddApprovedToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :approved, :boolean, default: false
  end
end
