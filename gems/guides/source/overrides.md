# Rhino Overrides

This guide is an introduction to how overriding Rhino behaviour works.

## Overrides

Rhino implements the pattern defined in https://nubinary.github.io/rhino-guides/engines.html#improving-engine-functionality both in its engines and in `config/application.rb` for the Boilerplate.

You may override classes in Rhino this way or may override classes that Rhino itself overrides.

It is recommended you follow the pattern `app/overrides/<gem_or_engine>/<class>_override.rb`

You can use `class_eval` as noted in the above guide, or if you need to call `super` of the method you are overriding use the _Mixin Prepending_ pattern defined in https://stackoverflow.com/questions/4470108/when-monkey-patching-an-instance-method-can-you-call-the-overridden-method-from/4471202. See `registrations_controller_override.rb` for an example.

## What Rhino Overrides

Rhino itself overrides some classes of dependent gems.

### DeviseTokenAuth::ConfirmationsController

> Overrides `show` in order to redirect to the front end if an error is thrown

### DeviseTokenAuth::OmniauthCallbacksController

> Overrides `omniauth_success` in order to set the auth cookie before redirect so client is logged in.

### DeviseTokenAuth::PasswordsController

> Overrides `render_edit_error` in order to redirect to the front end if password reset token has expired

### DeviseTokenAuth::SessionsController

> Overrides `render_destroy_error` in order to clean the auth cookie if there's any error during sign out.

### DeviseTokenAuth::TokenValidationsController

> Overrides `render_validate_token_error` in order to clean the auth cookie if there's any error in validating the current token.

### ActiveStorage::DirectUploadsController

> Overrides `create` in order to enforce authorization

## What Rhino Organizations Overrides

### DeviseTokenAuth::RegistrationsController

> Overrides `create` in order to create a new organization on registration

### DeviseTokenAuth::OmniauthCallbacksController

> Overrides `omniauth_success` in order to create a new organization on registration

## Testing Overrides

Rhino provides Rhino::TestCase::Override for testing policies.
