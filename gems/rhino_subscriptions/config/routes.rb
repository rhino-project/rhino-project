Rails.application.routes.draw do

    scope Rhino.namespace do

      get 'subscription/prices' , to: 'rhino/stripe#prices'
      post 'subscription/customer' ,to: 'rhino/stripe#customer'
      get 'subscription/subscriptions' ,to: 'rhino/stripe#subscriptions'
      post 'subscription/create-checkout-session' ,to: 'rhino/stripe#create_checkout_session'
      get 'subscription/check_session_id' ,to: 'rhino/stripe#check_session_id'

    end
end
