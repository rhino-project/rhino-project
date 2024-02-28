# config/initializers/omniauth.rb
Rails.application.config.middleware.use OmniAuth::Builder do
  Rhino::OmniauthHelper.strategies.each do |strategy|
    # http://localhost:3002/api/auth/strategy?auth_origin_url=http://localhost:3003/signin
    # For example provider :github, ENV['AUTH_GITHUB_CLIENT_ID'], ENV['AUTH_GITHUB_SECRET_KEY']
    provider strategy, *Rhino::OmniauthHelper.app_info(strategy)
  end
end
