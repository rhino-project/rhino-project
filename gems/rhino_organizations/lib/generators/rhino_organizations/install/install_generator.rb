# frozen_string_literal: true

module RhinoOrganizations
  module Generators
    class InstallGenerator < ::Rails::Generators::Base
      source_root File.expand_path('templates', __dir__)

      def install_models
        say 'Copying rhino_organizations models to app/models'
        copy_file "#{__dir__}/templates/organization.rb", 'app/models/organization.rb'
        copy_file "#{__dir__}/templates/role.rb", 'app/models/role.rb'
        copy_file "#{__dir__}/templates/users_role.rb", 'app/models/users_role.rb'

        data = <<-'RUBY'
        has_many :users_roles, dependent: :destroy
        has_many :organizations, through: :users_roles
        has_many :roles, through: :users_roles
        RUBY

        inject_into_file 'app/models/user.rb', optimize_indentation(data, 2), after: "class User < Rhino::User\n"
      end

      def install_initializer
        gsub_file 'config/initializers/rhino.rb', "  # config.base_owner = 'Organization'", "  config.base_owner = 'Organization'"

        data = 'config.resources += ["Organization"]'
        inject_into_file 'config/initializers/rhino.rb', optimize_indentation(data, 2), after: /^\s*config\.resources.+\n/
      end
    end
  end
end
