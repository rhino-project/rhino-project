$:.push File.expand_path("lib", __dir__)

version = File.read(File.expand_path("../RHINO_PROJECT_VERSION", __dir__)).strip

# Describe your gem and declare its dependencies:
Gem::Specification.new do |spec|
  spec.name        = "rhino_project_jobs"
  spec.version     = version
  spec.authors     = ["JP Rosevear"]
  spec.email       = ["jp@codalio.com"]
  spec.homepage    = ""
  spec.summary     = ""
  spec.description = ""
  spec.license     = "MIT"

  spec.files = Dir["{app,config,db,lib}/**/*", "Rakefile", "README.md", "LICENSE"]

  spec.add_dependency "rails", "~> 7.1.0", ">= 7.1.0"
  spec.add_dependency "rhino_project_core", version
  spec.add_dependency 'resque', '2.6.0'
  spec.add_dependency 'resque-scheduler', '4.10.2'
  spec.add_dependency 'resque-heroku-signals', '2.6.0'
  spec.add_dependency 'active_scheduler', '0.7.0'
end
