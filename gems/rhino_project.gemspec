# frozen_string_literal: true

version = File.read(File.expand_path("RHINO_PROJECT_VERSION", __dir__)).strip

Gem::Specification.new do |s|
  s.platform    = Gem::Platform::RUBY
  s.name        = "rhino_project"
  s.version     = version
  s.summary     = ""
  s.description = ""

  s.required_ruby_version     = ">= 3.1.0"
  s.required_rubygems_version = ">= 1.8.11"

  s.license = "MIT"

  s.author   = ""
  s.email    = ""
  s.homepage = "https://rhino-project.org"

  s.files = ["README.md", "LICENSE"]

  s.metadata = {
  }

  s.add_dependency "rhino_project_core", version
  s.add_dependency "rhino_project_organizations", version
  s.add_dependency "rhino_project_jobs", version
  s.add_dependency "rhino_project_notifications",    version
  s.add_dependency "rhino_project_subscriptions",  version
  s.add_dependency "ruby-openai", "~> 6.3.1"
  s.add_dependency "bundler", ">= 1.15.0"
end
