# frozen_string_literal: true

module Rhino
  class StripeCustomer < ApplicationRecord
    belongs_to :base_owner, class_name: "::#{Rhino.base_owner.name}"
    rhino_owner_base
  end
end
