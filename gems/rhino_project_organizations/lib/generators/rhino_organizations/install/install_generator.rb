# frozen_string_literal: true

module RhinoOrganizations
  module Generators
    class InstallGenerator < ::Rails::Generators::Base
      source_root File.expand_path('templates', __dir__)

      def install_models
        say 'Copying rhino_organizations models to app/models'
        copy_file "#{__dir__}/templates/models/organization.rb", 'app/models/organization.rb'
        copy_file "#{__dir__}/templates/models/role.rb", 'app/models/role.rb'
        copy_file "#{__dir__}/templates/models/users_role.rb", 'app/models/users_role.rb'
        copy_file "#{__dir__}/templates/models/users_role_invite.rb", 'app/models/users_role_invite.rb'

        data = <<-'RUBY'
        has_many :users_roles, dependent: :destroy
        has_many :organizations, through: :users_roles
        has_many :roles, through: :users_roles
        RUBY

        inject_into_file 'app/models/user.rb', optimize_indentation(data, 2), after: "class User < Rhino::User\n"

        data = <<-'RUBY'
        has_many :users_roles, dependent: :destroy, foreign_key: :user_id, inverse_of: false
        has_many :organizations, through: :users_roles
        has_many :roles, through: :users_roles
        RUBY
        inject_into_file 'app/models/account.rb', optimize_indentation(data, 2), after: "class Account < Rhino::Account\n"
      end

      def install_devise_invitable
        generate "devise_invitable:install"

        # Set a sane default
        gsub_file "config/initializers/devise.rb", /^  \# config.invitation_limit = 5/, "  config.invitation_limit = 5"
      end

      def install_initializer
        gsub_file 'config/initializers/rhino.rb', "  # config.base_owner = 'Organization'", "  config.base_owner = \"Organization\""

        data = 'config.resources += ["Organization", "UsersRole", "Role", "UsersRoleInvite"]'
        inject_into_file 'config/initializers/rhino.rb', optimize_indentation(data, 2), after: /^\s*config\.resources.+\n/
      end

      def install_seeds
        say 'Copying seed files'
        copy_file "#{__dir__}/templates/seeds/organizations.rb", 'db/seeds/development/organizations.rb'
        copy_file "#{__dir__}/templates/seeds/organizations.rb", 'db/seeds/test/organizations.rb'
      end

      def install_active_admin
        say 'Copying rhino_organization ActiveAdmin files and configurations'
        copy_file "#{__dir__}/templates/admin/users_roles.rb", 'app/admin/users_roles.rb'
        data = <<-'RUBY'
        br
        br
        panel "User Roles" do
          table_for user.users_roles do
            column :organization
            column :role
          end
        end
        RUBY
        inject_into_file 'app/admin/users.rb', optimize_indentation(data, 4), after: "default_main_content\n"
      end
    end
  end
end
