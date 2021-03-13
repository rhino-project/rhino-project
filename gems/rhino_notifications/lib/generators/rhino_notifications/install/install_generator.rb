# frozen_string_literal: true

module RhinoNotifications
  module Generators
    class InstallGenerator < ::Rails::Generators::Base
      source_root File.expand_path('templates', __dir__)

      def install
        generate 'activity_notification:install'
        generate 'activity_notification:migration'
      end
    end
  end
end
