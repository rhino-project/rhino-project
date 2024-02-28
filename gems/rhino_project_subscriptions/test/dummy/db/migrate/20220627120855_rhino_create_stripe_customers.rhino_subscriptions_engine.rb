# This migration comes from rhino_subscriptions_engine (originally 20210302208003)
class RhinoCreateStripeCustomers < ActiveRecord::Migration[6.0]
  def change
    create_table :stripe_customers do |t|
      t.references :user, null: false, foreign_key: true
      t.string :customer_id
      t.string :current_stripe_session_id

      t.timestamps
    end

  end
end
