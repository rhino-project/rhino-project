# Rhino Authenticaion

This guide is an introduction to Rhino Authentication

## Authentication

Authentication in Rhino uses devise_token_auth which itself is built on devise. Omniauth is used for 3rd party authentication via OAuth2.

### OmniAuth OAuth2 Providers

OmniAuth providers can be add with the following steps

- Add `gem 'omniauth-facebook'` to Gemfile
- `bundle install`
- Add environment variables for the strategy, `AUTH_<UPPER CASE STRATEGY>_CLIENT_ID`, `AUTH_<UPPER CASE STRATEGY>_SECRET_KEY`, for example
  `AUTH_FACEBOOK_CLIENT_ID`, `AUTH_FACEBOOK_SECRET_KEY`

The oauth modules will then be advertised as part of the rhino open api response.

```
"info": {
  "title": "BoilerPlate API",
  "version": "0.0.0",
  "x-rhino-info": {
    "version": "0.2.0",
    "authOwner": "user",
    "baseOwner": "user",
    "oauth": [
      "google_oauth2",
      "github",
      "developer"
    ],
    "modules": {
    }
  }
```

#### Google

https://console.developers.google.com/apis/credentials and set up "OAuth 2.0 Client IDs" call back will be `http://localhost:3000/api/auth/omniauth/google_oauth2/callback` for development

#### Github

https://github.com/settings/developers and do "New OAuth App" callback will be `http://localhost:3002/api/auth/omniauth/github/callback`
