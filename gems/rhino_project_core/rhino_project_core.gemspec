$LOAD_PATH.push File.expand_path('lib', __dir__)

version = File.read(File.expand_path("../RHINO_PROJECT_VERSION", __dir__)).strip

# Describe your gem and declare its dependencies:
Gem::Specification.new do |spec|
  spec.name        = 'rhino_project_core'
  spec.version     = version
  spec.authors     = ['JP Rosevear']
  spec.email       = ['jprosevear@nubinary.com']
  spec.homepage    = ''
  spec.summary     = ''
  spec.description = ''
  spec.license     = "MIT"

  spec.files = Dir['{app,config,db,lib}/**/*', 'Rakefile', 'README.md', 'LICENSE']

  spec.add_dependency "rails", "~> 7.0.0", ">= 7.0.0"

  # Super Admin
  spec.add_dependency "activeadmin", "2.14.0"

  # Authentication
  spec.add_dependency "devise", "4.9.4"
  spec.add_dependency "devise_token_auth", "1.2.3"

  # Generate patterns for OpenAPI schemas
  spec.add_dependency "js_regex", "3.11.1"

   # Authorization
  spec.add_dependency "pundit", "2.1.0"

  spec.add_dependency "rake", "~> 13.1"

  # Used to build ownership graph in development http://localhost:3000/api/info/graph
  spec.add_dependency "rgl", "0.6.6"
end
