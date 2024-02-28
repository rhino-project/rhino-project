# This migration comes from rhino_engine (originally 20200503182019)
class ChangeTokensToJsonB < ActiveRecord::Migration[5.2]
  def up
    change_column :users, :tokens, 'jsonb using tokens::jsonb'
  end

  def down
    change_column :users, :tokens, 'json using tokens::json'
  end
end
