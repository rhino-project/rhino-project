# Error reporting for Ruby on Rails applications

Backend applications generally are easy to set up error reporting tools, as they generally don't count with code minification, obfuscation, etc.

## Making it work

After adding the gem, Rollbar provides an install command that places an initializer file for configuration that does the basic things necessary to make it work. Adding the following snippet will make sure it doesn't run on development or test environments:

```ruby
if Rails.env.test? || Rails.env.development?
  config.enabled = false
end
```
