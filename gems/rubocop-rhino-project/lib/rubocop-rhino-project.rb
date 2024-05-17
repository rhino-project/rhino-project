# frozen_string_literal: true

require "rubocop"
require "rack/utils"
require "active_support/inflector"
require "active_support/core_ext/object/blank"

require_relative "rubocop/rhino_project"
require_relative "rubocop/rhino_project/version"
require_relative "rubocop/rhino_project/inject"
require_relative "rubocop/rhino_project/schema_loader"
require_relative "rubocop/rhino_project/schema_loader/schema"

RuboCop::RhinoProject::Inject.defaults!

require_relative "rubocop/cop/rhino_project_cops"

RuboCop::Cop::Style::HashExcept.minimum_target_ruby_version(2.0)
