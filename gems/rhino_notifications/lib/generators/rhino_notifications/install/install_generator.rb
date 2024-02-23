# frozen_string_literal: true

module RhinoNotifications
  module Generators
    class InstallGenerator < ::Rails::Generators::Base
      source_root File.expand_path('templates', __dir__)

      def install
        generate 'activity_notification:install'
        generate 'activity_notification:migration'
      end

      def user_as_target
        inject_into_file "app/models/user.rb", "#{optimize_indentation('acts_as_target email: :email', 2)}\n", after: "class User < Rhino::User\n"
      end
    end
  end
end
