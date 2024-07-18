# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config

  # We introspect the models to create the admin interface
  # https://github.com/activeadmin/activeadmin/issues/783#issuecomment-244587442
  ActiveAdmin.routes(self) rescue ActiveAdmin::DatabaseHitDuringLoad

  root to: redirect(ENV["FRONT_END_URL"] || "/"), via: :all
end
