# frozen_string_literal: true

ActiveAdmin.register UsersRole do
  permit_params :user_id, :organization_id, :role_id
end
