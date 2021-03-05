# Rhino Subscriptions

This guide is an introduction to Rhino Subscription module

## Stripe Subscription

Rhino Subscriptions uses Stripe platform for subscriptions. Rhino existing integration uses stripe checkout which is interchangeable to a local checkout page if customized.

### Integrating Rhino Subscriptions

Rhino subscriptions can be added by the following steps:

1. Create an account in [Stripe platform](https://stripe.com). Complete setting up the account and make sure the project business name is added [here](https://dashboard.stripe.com/account)
2. Apply the business model as one `product` and its `prices` on [stripe](https://dashboard.stripe.com/test/products/create).
   Note: Current setup supports one product and multiple plans.
3. Get Publishable key and Secret key from Stripe [profile](https://dashboard.stripe.com/test/apikeys) and use them in ENV variables as `STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY` in server side and `STRIPE_PUBLISHABLE_KEY` in front side ENV.
4. Install Rhino Subscriptions module using this command: `rails rhino_subscriptions:install` then use `rails db:migrate` to complete migration of the newly added model.
5. Check everything is working and/or customize stripe experience.
   To checkout in test mode, use these [test card numbers](https://stripe.com/docs/testing#cards).
6. Change your stripe profile from test mode to live mode.

### How it works

![How it works](../app/assets/stripe_flow.png)

### Rhino API doc

- `api/subscription/prices`: Returns the related prices from stripe for UI
- `api/subscription/create_checkout_session`: Creates a new checkout session with the info to redirect to Stripe checkout page for payment and updates local model stripe_customer
- `api/subscription/subscriptions`: returns list of subscriptions customer has and their info
- `api/subscription/customer`: returns local stripe customer info of a user

### Read more

Find out more about Stripe major concepts used in this integration:

- [Product and Prices](https://stripe.com/docs/billing/prices-guide)
- [Customer](https://stripe.com/docs/billing/customer)
- [Stripe checkout](https://stripe.com/docs/payments/checkout)
- [Prebuilt Checkout Page doc page](https://stripe.com/docs/checkout/integration-builder)
