# frozen_string_literal: true

module Rhino
  module Generators
    module Dev
      class SetupGenerator < ::Rails::Generators::Base
        class_option :prompt, type: :boolean, default: true
        class_option :server_port, type: :numeric
        class_option :client_port, type: :numeric
        class_option :client_source, type: :string
        class_option :db_name, type: :string
        class_option :db_user, type: :string
        class_option :db_password, type: :string

        attr_reader :server_port,
                    :client_port,
                    :client_source,
                    :db_name,
                    :db_user,
                    :db_password

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
          copy_file "prepare-commit-msg",
                    ".git/hooks/prepare-commit-msg",
                    mode: :preserve
          copy_file "prepare-commit-msg",
                    client_file(".git/hooks/prepare-commit-msg"),
                    mode: :preserve
        end

        private
          def server_extension
            Rails.root.basename.to_s.match(/[-_]?server/)[0]
          end

          def client_extension
            server_extension.sub("server", "client")
          end

          def server_port_default
            options[:server_port] || ENV["PORT"] || 3000
          end

          def client_port_default
            @server_port.to_i + 1
          end

          def client_source_default
            ENV["CLIENT_SOURCE"] ||
              Rails.root.sub(server_extension, client_extension)
          end

          def db_name_default
            db_name =
              options[:db_name] || ENV["DB_NAME"] ||
              File.basename(Rails.root).sub(server_extension, "")

            return db_name if db_name.present?

            File.basename(Rails.root.parent)
          end

          def db_user_default
            options[:db_user] || ENV["DB_USERNAME"]
          end

          def db_password_default
            options[:db_password] || ENV["DB_PASSWORD"]
          end

          def collect_env_info
            @server_port = ask_prompt("Server Port?", server_port_default)
            @client_port = ask_prompt("Client Port?", client_port_default)

            @client_source = ask_prompt("Client Source?", client_source_default)

            @db_name = ask_prompt("Database?", db_name_default)
            @db_user = ask_prompt("Database User?", db_user_default)
            @db_password = ask_prompt("Database Password?", db_password_default)
          end

          def client_file(file)
            "#{@client_source}/#{file}"
          end

          def ask_prompt(message, default)
            return default unless options[:prompt]

            ask(message, default:)
          end
      end
    end
  end
end
