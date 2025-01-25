# frozen_string_literal: true

require "rhino_subscriptions/engine"
# require 'active_support'

module RhinoSubscriptions
  # The list of products to show on the subscription page
  mattr_accessor :products, default: :all

  mattr_accessor :payment_method_collection, default: :always

  def self.products=(products)
    @@products = Array.wrap(products)
  end

  def self.payment_method_collection=(payment_method_collection)
    @@payment_method_collection = payment_method_collection
  end

  # Default way to set up Rhino Subscriptions
  def self.setup
    yield self
  end
end
