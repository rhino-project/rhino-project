Rails.application.routes.draw do
  scope Rhino.namespace do
    notify_to :users, api_mode: true, with_devise: :users
  end
end
