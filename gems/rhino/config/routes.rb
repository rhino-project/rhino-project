# frozen_string_literal: true

Rails.application.routes.draw do
  scope Rhino.namespace do
    Rhino.resource_classes.each do |m|
      resources m.route_key, path: m.route_path, controller: m.controller_name, only: m.routes, rhino_resource: m.name
    end

    post 'filestack_pictures/upload_policy', to: 'filestack_pictures#upload_policy'
    post 'filestack_pictures', to: 'filestack_pictures#create'

    # get 'info/models', controller: 'rhino/crud', action: 'models' if Rails.env.development?
  end

  match "*#{Rhino.namespace}", to: 'rhino/base#not_found', via: :all, constraints: lambda { |request|
    request.url[/\/rails\/active_storage\//].nil?
  }
end
