# frozen_string_literal: true

module RhinoSubscriptions
  module Generators
    class InstallGenerator < ::Rails::Generators::Base
      source_root File.expand_path('templates', __dir__)

      def install
        template "rhino_subscriptions.rb", "config//initializers/rhino_subscriptions.rb"
      end
    end
  end
end
