$LOAD_PATH.push File.expand_path('lib', __dir__)

version = File.read(File.expand_path("../RHINO_PROJECT_VERSION", __dir__)).strip

# Describe your gem and declare its dependencies:
Gem::Specification.new do |spec|
  spec.name        = 'rhino_project_core'
  spec.version     = version
  spec.authors     = ['JP Rosevear']
  spec.email       = ['jp@codalio.com']
  spec.homepage    = ''
  spec.summary     = ''
  spec.description = ''
  spec.license     = "MIT"

  spec.files = Dir['{app,config,db,lib}/**/*', 'Rakefile', 'README.md', 'LICENSE']

  spec.add_dependency "rails", "~> 7.2.0", ">= 7.2.0"

  # Super Admin
  spec.add_dependency "activeadmin", "3.2.2"

  # Tagging
  spec.add_dependency "acts-as-taggable-on", "11.0.0"

  # Analytics
  spec.add_dependency "analytics-ruby", "2.0.13"

  # Tree structure
  spec.add_dependency "ancestry", "4.0.0"

  # Owner hierarchy joins
  spec.add_dependency "arel-helpers", "2.15.0"

  # Country field support
  spec.add_dependency "countries", "6.0.0"

  # Authentication
  spec.add_dependency "devise", "4.9.4"
  spec.add_dependency "devise_token_auth"

  # Friendly id slugs
  spec.add_dependency "friendly_id", "5.3.0"

  # Friendly id slugs
  spec.add_dependency "geocoder", "1.8.2"

  # Generate patterns for OpenAPI schemas
  spec.add_dependency "js_regex", "3.11.1"

  # OmniAuth and extensions
  spec.add_dependency "omniauth", "2.1.2"
  spec.add_dependency "omniauth-azure-activedirectory-v2", "2.0.1"
  spec.add_dependency "omniauth-auth0", "3.1.1"
  spec.add_dependency "omniauth-facebook", "9.0.0"
  spec.add_dependency "omniauth-github", "2.0.1"
  spec.add_dependency "omniauth-google-oauth2", "1.1.1"
  spec.add_dependency "omniauth-rails_csrf_protection", "1.0.1"

  # Full text search
  spec.add_dependency "pg_search", "2.3.6"

  # Phone field support
  spec.add_dependency "phonelib", "0.6.51"

   # Authorization
  spec.add_dependency "pundit", "2.1.0"

  # CORS support
  spec.add_dependency "rack-cors", "1.1.1"

  spec.add_dependency "rake", "~> 13.1"

  # Used to build ownership graph in development http://localhost:3000/api/info/graph
  spec.add_dependency "rgl", "0.6.6"
end
