# frozen_string_literal: true

$LOAD_PATH.unshift File.expand_path('lib', __dir__)

version = File.read(File.expand_path("../RHINO_PROJECT_VERSION", __dir__)).strip

Gem::Specification.new do |spec|
  spec.name = 'rubocop-rhino-project'
  spec.version     = version
  spec.authors     = ['JP Rosevear']
  spec.email       = ['jprosevear@nubinary.com']
  spec.homepage    = ''
  spec.summary     = ''
  spec.description = ''
  spec.license     = "MIT"

  s.files = Dir['config/**/*', 'lib/**/*']

  s.add_runtime_dependency 'activesupport', '>= 4.2.0'
  # Rack::Utils::SYMBOL_TO_STATUS_CODE, which is used by HttpStatus cop, was
  # introduced in rack 1.1
  s.add_runtime_dependency 'rack', '>= 1.1'
  s.add_runtime_dependency 'rubocop', '>= 1.33.0', '< 2.0'
  s.add_runtime_dependency 'rubocop-ast', '>= 1.31.1', '< 2.0'
end
