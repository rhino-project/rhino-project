# frozen_string_literal: true

module Rhino
  class Account < User
    self.table_name = "users"

    rhino_owner_global

    rhino_routing only: %i[show update], singular: true
    rhino_controller :account
    rhino_policy :account
  end
end
