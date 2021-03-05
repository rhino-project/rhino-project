# frozen_string_literal: true

module Rhino
  class StripeCustomer < ApplicationRecord
    belongs_to :user
  end
end
