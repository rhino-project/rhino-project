# frozen_string_literal: true

module Rhino
  module Generators
    module Dev
      class SetupGenerator < ::Rails::Generators::Base
        attr_reader :server_port, :client_port, :client_source, :db_name, :db_user, :db_password

        source_root File.expand_path("templates", __dir__)

        def setup_env
          say "Setting up local .env files"

          collect_env_info

          template "env.server", ".env"
          template "env.client", client_file(".env")
        end

        def install_hooks
          say "Installing git hooks"
          # Hooks need to be executable
          copy_file "prepare-commit-msg", ".git/hooks/prepare-commit-msg", mode: :preserve
          copy_file "prepare-commit-msg", client_file(".git/hooks/prepare-commit-msg"), mode: :preserve
        end

        private
          def server_port_default
            ENV["PORT"] || 3000
          end

          def client_port_default
            @server_port.to_i + 1
          end

          def client_source_default
            ENV["CLIENT_SOURCE"] || Rails.root.sub("_server", "_client")
          end

          def db_name_default
            ENV["DB_NAME"] || File.basename(Rails.root).sub("_server", "")
          end

          def db_user_default
            ENV["DB_USERNAME"]
          end

          def db_password_default
            ENV["DB_PASSWORD"]
          end

          def collect_env_info
            @server_port = ask "Server Port?", default: server_port_default
            @client_port = ask "Client Port?", default: client_port_default

            @client_source = ask "Client Source?", default: client_source_default

            @db_name = ask "Database?", default: db_name_default
            @db_user = ask "Database User?", default: db_user_default
            @db_password = ask "Database Password?", default: db_password_default
          end

          def client_file(file)
            "#{@client_source}/#{file}"
          end
      end
    end
  end
end
