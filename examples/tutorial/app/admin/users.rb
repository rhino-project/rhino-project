# frozen_string_literal: true

ActiveAdmin.register User do
  permit_params :name, :email, :password, :password_confirmation, :approved

  menu label: "Users"
  index do
    selectable_column
    column :id
    column :uid
    column :email
    column :created_at
    column :current_sign_in_at
    column :last_sign_in_at
    column :current_sign_in_ip
    column :confirmed_at
    actions
  end

  form do |f|
    f.inputs do
      f.input :name
      f.input :email
      f.input :password if f.object.new_record?
      f.input :password_confirmation if f.object.new_record?
      f.input :approved
    end
    f.actions
  end

  show do
    default_main_content
  end
end
