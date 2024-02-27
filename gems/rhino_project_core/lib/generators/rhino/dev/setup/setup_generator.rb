# frozen_string_literal: true

module Rhino
  module Generators
    module Dev
      # rubocop:disable Metrics/ClassLength
      class SetupGenerator < ::Rails::Generators::Base
        class_option :prompt, type: :boolean, default: true
        class_option :server_port, type: :numeric
        class_option :client_port, type: :numeric
        class_option :db_host, type: :string
        class_option :db_name, type: :string
        class_option :db_port, type: :numeric
        class_option :db_user, type: :string
        class_option :db_password, type: :string
        class_option :redis_port, type: :numeric
        class_option :redis_database, type: :numeric

        attr_reader :server_port,
                    :client_port,
                    :db_name,
                    :db_host,
                    :db_port,
                    :db_user,
                    :db_password,
                    :redis_host,
                    :redis_port,
                    :redis_database,
                    :dockerized

        source_root File.expand_path("templates", __dir__)

        def setup_env
          say "Setting up local .env files"

          collect_env_info

          template "env.server", server_file(".env")
          template "env.client", client_file(".env")
        end

        def install_hooks
          say "Installing git hooks"
          # Hooks need to be executable
          copy_file "prepare-commit-msg",
                    project_file(".git/hooks/prepare-commit-msg"),
                    mode: :preserve
        end

        private
          def project_dir
            # Up one level from the server directory
            Rails.root.parent
          end

          def server_extension
            Rails.root.basename.to_s.match(/[-_]?server/)[0]
          end

          def server_port_default
            options[:server_port] || ENV["PORT"] || 3000
          end

          def client_port_default
            @server_port.to_i + 1
          end

          def db_name_default
            db_name =
              options[:db_name] || ENV["DB_NAME"] ||
              File.basename(project_dir).sub(/[-_]?mono/, "")

            return db_name if db_name.present?

            File.basename(Rails.root.parent)
          end

          def db_host_default
            options[:db_host] || ENV["DB_HOST"] || "localhost"
          end

          def db_port_default
            options[:db_port] || ENV["DB_PORT"] || 5432
          end

          def db_user_default
            options[:db_user] || ENV["DB_USERNAME"] || (dockerized ? "postgres" : "")
          end

          def db_password_default
            options[:db_password] || ENV["DB_PASSWORD"] || (dockerized ? "password" : "")
          end

          def redis_host_default
            options[:redis_host] || ENV["REDIS_HOST"] || "localhost"
          end

          def redis_port_default
            options[:redis_port] || ENV["REDIS_PORT"] || 6379
          end

          def redis_database_default
            options[:redis_database] || ENV["REDIS_DATABASE"] || 0
          end

          def dockerized_default
            "yN"
          end

          def collect_env_info
            collect_docker_info

            @server_port = ask_prompt("Server Port?", server_port_default)
            @client_port = ask_prompt("Client Port?", client_port_default)

            collect_database_info
            collect_redis_info
          end

          def collect_docker_info
            @dockerized = %w[y Y].include?(ask_prompt("Run server on docker?", dockerized_default))

            return unless dockerized

            @db_host = "db"
            @redis_host = "redis"
            @redis_port = 6379

            puts <<~HERE
              The following docker configuration has been automatically set for you:
              Database host: #{db_host}
              Redis host: #{redis_host}
              Redis port: #{redis_port}
            HERE
          end

          def collect_database_info # rubocop:todo Metrics/AbcSize
            @db_name = ask_prompt("Database?", db_name_default)
            @db_host = ask_prompt("Database host?", db_host_default) unless dockerized
            @db_port = ask_prompt("Database port?", db_port_default)
            @db_user = ask_prompt("Database User?", db_user_default) until !dockerized || db_user.present?
            @db_password = ask_prompt("Database Password?", db_password_default) until !dockerized || db_password.present?
          end

          def collect_redis_info
            unless dockerized
              @redis_host = ask_prompt("Redis host?", redis_host_default)
              @redis_port = ask_prompt("Redis port?", redis_port_default)
            end

            @redis_database = ask_prompt("Redis database?", redis_database_default)
          end

          def project_file(file)
            File.join(project_dir, file)
          end

          def client_file(file)
            File.join(project_dir, "client", file)
          end

          def server_file(file)
            File.join(project_dir, "server", file)
          end

          def ask_prompt(message, default)
            return default unless options[:prompt]

            ask(message, default:)
          end
      end
      # rubocop:enable Metrics/ClassLength
    end
  end
end
