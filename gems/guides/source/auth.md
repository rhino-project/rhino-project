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

```json
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

## Cookies

Rhino Client's authentication system is based on httponly cookies, issued by the server, and therefore not accessible via javascript.

### First-party vs Third-party cookies

Browsers differentiate these two types of cookies by analyzing who issued the cookie. Basically, if the cookie was issued by a server in the same domain, it's considered to be a first-party cookie, even if client and server live in different subdomains. For instance, a browser running `client.nubinary.com` would treat cookies issued by the server at `server.nubinary.com` as a first-party cookie. [See reference.](https://www.cookiepro.com/knowledge/whats-the-difference-between-first-and-third-party-cookies/#:~:text=The%20main%20differences%20between%20first,loaded%20on%20the%20publisher's%20website.)

Third-party cookie are often used for advertisment purposes and are related to many privacy issues, so browsers are constantly restricting their use. [Chrome's Incognito mode and Brave now just block them completely.](https://venturebeat.com/2020/05/19/google-chrome-83/#:~:text=In%20Incognito%20mode%2C%20Chrome%20doesn,icon%20in%20the%20address%20bar.)

### SameSite attribute

This is an important attribute that can restrict cookies usage even more. For an API, however, they need to be more relaxed, so `SameSite=None` is currently the used setting. Read more about SameSite definition in [here](https://web.dev/samesite-cookies-explained/) and in this [issue](https://github.com/google/google-api-javascript-client/issues/561).

Rhino Server also sets these cookies to be secure, meaning they can only be served through a https connection. Due to recent changes and restrictions to cookies,

### Domain restriction

In a regular API backend + SPA frontend setup, client and server often live in different subdomains of a same domain. This could lead to server cookies being treated as third-party, but it’s possible to make them behave as first-party. Currently, cookie's `domain` attribute is not set by Rhino Server, as per the [OWASP guide](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#domain-and-path-attributes). The guide states that it is the most restrictive, therefore safe, way. Theoretically, it only send the cookies to the host that issued them. Other references:

- [Does a session cookie on different subdomain count as 3rd-party?](https://stackoverflow.com/questions/10092567/does-a-session-cookie-on-different-subdomain-count-as-3rd-party)
- [For SameSite cookie with subdomains what are considered the same site?](https://security.stackexchange.com/questions/223473/for-samesite-cookie-with-subdomains-what-are-considered-the-same-site)
- [What differentiates firt- and third-party cookies, and what are the consequences of subdomain restriction?](https://helpcentre.atinternet-solutions.com/hc/en-gb/articles/360000329339-What-differentiates-first-and-third-party-cookies-and-what-are-the-consequences-of-subdomain-restriction-)

### WARNING: Special domains

[Some domains](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/net/base/registry_controlled_domains/effective_tld_names.dat#12130) have a special treatment by browsers - cookies are always treated as 3rd-party when issued by a different subdomain, even though the domain is the same. For instance, a browser running `client.nubinary.com.herokuapp` would treat as 3rd-party any cookies emitted by `server.nubinary.herokuapp.com`, because the domain is `herokuapp.com` and it has a special treatment as per the link.
