# frozen_string_literal: true

require 'stripe'
require 'rhino/stripe_customer'

::Stripe.api_key = ENV['STRIPE_SECRET_KEY']

module Rhino
  class StripeController < Rhino::BaseController
    def prices
      list = ::Stripe::Price.list({ limit: 5 })
      prices = list['data'].map do |column|
        { id: column['id'], name: column['nickname'], amount: column['unit_amount'] }
      end
      render json: {
        publishableKey: ENV['STRIPE_PUBLISHABLE_KEY'],
        prices: prices
      }
    end

    def create_checkout_session
      # TODO: check for exiting sessions to avoid errors
      sc = get_stripe_customer(Rhino::StripeCustomer.find_by(user: current_user))

      session = checkout_session(sc.customer_id, params)
      sc.current_stripe_session_id = session.id
      sc.save

      render json: {
        sessionId: session.id
      }
    end

    def get_stripe_customer(stripe_customer)
      if stripe_customer
        stripe_customer
      else
        customer = ::Stripe::Customer.create(email: current_user.email)
        Rhino::StripeCustomer.create!(user: current_user, customer_id: customer.id)
      end
    end

    def customer
      user = current_user
      customer = ::Stripe::Customer.list({ email: user.email })

      render json: {
        customer: customer.data[0]
      }
    end

    def subscriptions
      # stripe_customer= customer
      stripe_customer = Rhino::StripeCustomer.find_by(user: current_user)
      if !stripe_customer
        render json: {}
      else
        customer = ::Stripe::Customer.retrieve({
          id: stripe_customer['customer_id'],
          expand: ['subscriptions']
        })

        render json: {
          subscriptions: customer.subscriptions.data
        }

      end
    end

    def checkout_session(customer_id, args)
      ::Stripe::Checkout::Session.create(
        success_url: ENV['FRONT_END_URL'] + args['success_url'],
        cancel_url: ENV['FRONT_END_URL'] + args['cancel_url'],
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [{
          quantity: 1,
          price: args['price']
        }],
        customer: customer_id
      )
    end
  end
end
