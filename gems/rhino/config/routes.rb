# frozen_string_literal: true

Rails.application.routes.draw do
  scope Rhino.namespace do
    mount_devise_token_auth_for 'User', at: "auth", controllers: {
      passwords: 'overrides/passwords',
      registrations: 'overrides/registrations',
      omniauth_callbacks: 'overrides/omniauth_callbacks'
    }

    Rhino.resource_classes.each do |m|
      resources m.route_key, path: m.route_path, controller: m.controller_name, only: m.routes, rhino_resource: m.name
    end
  end

  match "*#{Rhino.namespace}", to: 'rhino/base#not_found', via: :all, constraints: lambda { |request|
    request.url[/\/rails\/active_storage\//].nil?
  }
end
