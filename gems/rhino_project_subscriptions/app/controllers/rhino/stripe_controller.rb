# frozen_string_literal: true

require "stripe"

::Stripe.api_key = ENV["STRIPE_SECRET_KEY"]

module Rhino
  class StripeController < Rhino::BaseController
    include Rhino::Authenticated

    def prices
      list = ::Stripe::Price.list({ active: true, limit: 5, expand: ["data.product"] })
      render json: { prices: list["data"] }
    end

    def create_checkout_session
      authorize nil
      sc = get_stripe_customer(params["base_owner_id"])
      session = checkout_session(sc.customer_id, params)
      sc.current_stripe_session_id = session.id
      sc.save

      render json: {
        sessionId: session.id
      }
    end

    def customer
      stripe_customer = Rhino::StripeCustomer.find_by(base_owner_id: params["base_owner_id"])
      if stripe_customer
        customer = ::Stripe::Customer.retrieve({
          id: stripe_customer["customer_id"]
        })
        render json: {
          customer: customer.data[0]
        }
      else
        render json: {}
      end
    end

    def subscriptions
      stripe_customer = Rhino::StripeCustomer.find_by(base_owner_id: params["base_owner_id"])
      return render json: {} unless stripe_customer

      subscriptions = ::Stripe::Subscription.list({ customer: stripe_customer["customer_id"], expand: ["data.plan.product"] })

      render json: {
        subscriptions: subscriptions.data
      }
    end

    def check_session_id
      stripe_customer = Rhino::StripeCustomer.find_by(base_owner_id: params["base_owner_id"])
      render json: {
        session_matched: ((stripe_customer && stripe_customer["current_stripe_session_id"]) == params["session_id"])
      }
    end

    private
      def checkout_session(customer_id, args)
        ::Stripe::Checkout::Session.create(
          success_url: args["success_url"],
          cancel_url: args["cancel_url"],
          payment_method_types: ["card"],
          mode: "subscription",
          line_items: [{
            quantity: 1,
            price: args["price"]
          }],
          customer: customer_id
        )
      end

      def get_stripe_customer(_base_owner_id)
        Rhino::StripeCustomer.find_or_create_by!(base_owner_id: params["base_owner_id"]) do |stripe_customer|
          customer = ::Stripe::Customer.create(email: current_user.email)
          stripe_customer.customer_id = customer.id
        end
      end

    protected
      def policy(record = nil)
        StripePolicy.new(current_user, record)
      end
  end
end
