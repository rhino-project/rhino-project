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
      sc = get_stripe_customer(params['base_owner_id'])

      session = checkout_session(sc.customer_id, params)
      sc.current_stripe_session_id = session.id
      sc.save

      render json: {
        sessionId: session.id
      }
    end

    def customer
      stripe_customer = Rhino::StripeCustomer.find_by(base_owner_id: params['base_owner_id'])
      customer = ::Stripe::Customer.retrieve({
        id: stripe_customer['customer_id']
      })
      render json: {
        customer: customer.data[0]
      }
    end

    def subscriptions
      stripe_customer = Rhino::StripeCustomer.find_by(base_owner_id: params['base_owner_id'])

      if stripe_customer
        customer = ::Stripe::Customer.retrieve({
          id: stripe_customer['customer_id'],
          expand: ['subscriptions']
        })

        render json: {
          subscriptions: customer.subscriptions.data
        }

      else
        render json: {}
      end
    end

    def check_session_id
      stripe_customer = Rhino::StripeCustomer.find_by(base_owner_id: params['base_owner_id'])
      render json: {
        session_matched: ((stripe_customer && stripe_customer['current_stripe_session_id']) == params['session_id'])
      }
    end

    private
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

    def get_stripe_customer(_base_owner_id)
      Rhino::StripeCustomer.find_or_create_by!(base_owner_id: params['base_owner_id']) do |stripe_customer|
        customer = ::Stripe::Customer.create(email: current_user.email)
        stripe_customer.customer_id = customer.id
      end
    end
  end
end
