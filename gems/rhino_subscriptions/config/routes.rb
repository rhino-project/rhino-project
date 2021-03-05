Rails.application.routes.draw do

    scope Rhino.namespace do

      get 'subscription/prices' , to: 'rhino/stripe#prices'
      get 'subscription/customer' ,to: 'rhino/stripe#customer'
      get 'subscription/subscriptions' ,to: 'rhino/stripe#subscriptions'
      post 'subscription/create-checkout-session' ,to: 'rhino/stripe#create_checkout_session'

    end
end
