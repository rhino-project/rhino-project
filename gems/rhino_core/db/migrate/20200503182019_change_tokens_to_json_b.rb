class ChangeTokensToJsonB < ActiveRecord::Migration[5.2]
  def up
    change_column :users, :tokens, 'jsonb using tokens::jsonb'
  end

  def down
    change_column :users, :tokens, 'json using tokens::json'
  end
end
