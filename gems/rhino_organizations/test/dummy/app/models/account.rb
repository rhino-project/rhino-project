# frozen_string_literal: true

class Account < Rhino::Account
  has_many :users_roles, dependent: :destroy, foreign_key: :user_id
  has_many :organizations, through: :users_roles
  has_many :roles, through: :users_roles
end
