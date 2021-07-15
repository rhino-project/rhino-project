# frozen_string_literal: true

module Rhino
  class UsersRole < ApplicationRecord
    self.abstract_class = true

    rhino_policy :users_role
    rhino_owner :organization
    rhino_references %i[role organization]
  end
end
