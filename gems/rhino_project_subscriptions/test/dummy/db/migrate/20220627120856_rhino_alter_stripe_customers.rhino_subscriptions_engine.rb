# This migration comes from rhino_subscriptions_engine (originally 20210302299092)
class RhinoAlterStripeCustomers < ActiveRecord::Migration[6.0]
  def change

      remove_reference :stripe_customers, :user,  index: true
      add_reference :stripe_customers, :base_owner
    end
end
