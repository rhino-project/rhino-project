# frozen_string_literal: true

$LOAD_PATH.unshift File.expand_path('lib', __dir__)

version = File.read(File.expand_path("../RHINO_PROJECT_VERSION", __dir__)).strip

Gem::Specification.new do |spec|
  spec.name = 'rubocop-rhino-project'
  spec.version     = version
  spec.authors     = ['JP Rosevear']
  spec.email       = ['jp@codalio.com']
  spec.homepage    = ''
  spec.summary     = ''
  spec.description = ''
  spec.license     = "MIT"

  spec.files = Dir['config/**/*', 'lib/**/*']

  spec.add_runtime_dependency 'activesupport', '>= 4.2.0'
  spec.add_runtime_dependency 'rubocop', '>= 1.24.1', '< 2.0'
  spec.add_runtime_dependency 'rubocop-ast', '>= 1.21.0', '< 2.0'
  spec.add_runtime_dependency 'parser', "~> 3.3.5.0",  ">= 3.3.5.0"
end
