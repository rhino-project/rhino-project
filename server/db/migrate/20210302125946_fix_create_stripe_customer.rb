require_relative "20210219193346_create_stripe_customers"

class FixCreateStripeCustomer < ActiveRecord::Migration[6.0]
  def change
      revert CreateStripeCustomers
  end
end
