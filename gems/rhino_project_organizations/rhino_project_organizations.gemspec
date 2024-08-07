$:.push File.expand_path("lib", __dir__)

version = File.read(File.expand_path("../RHINO_PROJECT_VERSION", __dir__)).strip

# Describe your gem and declare its dependencies:
Gem::Specification.new do |spec|
  spec.name        = "rhino_project_organizations"
  spec.version     = version
  spec.authors     = ['JP Rosevear']
  spec.email       = ['jp@codalio.com']
  spec.homepage    = ""
  spec.summary     = ""
  spec.description = ""
  spec.license     = "MIT"

  spec.files = Dir["{app,config,db,lib}/**/*", "Rakefile", "README.md"]

  spec.add_dependency "rails", "~> 7.0.0", ">= 7.0.0"
  spec.add_dependency "rhino_project_core", version

  # User Invitations
  spec.add_dependency "devise_invitable", "2.0.9"
end
