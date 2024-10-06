# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config

  # We introspect the models to create the admin interface
  # https://github.com/activeadmin/activeadmin/issues/783#issuecomment-244587442
  ActiveAdmin.routes(self) rescue ActiveAdmin::DatabaseHitDuringLoad

  constraints lambda { |req| !req.path.starts_with?("/api/") && !req.path.starts_with?("/rails/") && !req.path.starts_with?("/jobs")} do
    match "*path", to: "frontend#root", via: :get
  end
  root to: "frontend#root", via: :get
end
