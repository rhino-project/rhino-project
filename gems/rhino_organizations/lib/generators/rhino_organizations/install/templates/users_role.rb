# frozen_string_literal: true

class UsersRole < Rhino::UsersRole
  belongs_to :user
  belongs_to :organization
  belongs_to :role
end
