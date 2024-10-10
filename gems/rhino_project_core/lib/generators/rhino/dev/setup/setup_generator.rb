# frozen_string_literal: true

module Rhino
  module Generators
    module Dev
      class SetupGenerator < ::Rails::Generators::Base
        DEFAULT_SERVER_PORT = 3000

        class_option :prompt, type: :boolean, default: true, desc: "Prompt user for configuration options"
        class_option :defaults, type: :string, enum: %w[local docker], default: "local", desc: "Use configuration defaults of type DEFAULTS"
        class_option :skip_existing, type: :boolean, default: false, desc: "Skip existing env files"
        class_option :server_port, type: :numeric, default: DEFAULT_SERVER_PORT, group: :server, desc: "Server port"
        class_option :db_host, type: :string, group: :database
        class_option :db_name, type: :string, group: :database
        class_option :db_port, type: :numeric, default: 5432, group: :database
        class_option :db_user, type: :string, group: :database
        class_option :db_password, type: :string, group: :database
        class_option :redis_port, type: :numeric, default: 6379, group: :redis
        class_option :redis_database, type: :numeric, default: 0, group: :redis

        attr_reader :server_port,
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

        def check_existing
          return unless options[:skip_existing] && File.exist?(project_file(".env"))

          say "Skipping existing .env files"
          exit(0)
        end

        def setup_env
          say "Setting up local .env files"

          collect_env_info

          template "env", project_file(".env")
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
            Rails.root
          end

          def server_port_default
            options[:server_port] || ENV["PORT"]
          end

          def project_name
            @project_name ||= File.basename(project_dir).sub(/[-_]?mono/, "")
          end

          def db_name_default
            db_name = options[:db_name] || ENV["DB_NAME"] || project_name

            return db_name if db_name.present?

            File.basename(Rails.root)
          end

          def db_host_default
            options[:db_host] || ENV["DB_HOST"] || "localhost"
          end

          def db_port_default
            options[:db_port] || ENV["DB_PORT"]
          end

          def db_user_default
            options[:db_user] || ENV["DB_USERNAME"] || `whoami`.strip
          end

          def db_password_default
            options[:db_password] || ENV["DB_PASSWORD"] || ""
          end

          def redis_host_default
            options[:redis_host] || ENV["REDIS_HOST"] || "localhost"
          end

          def redis_port_default
            options[:redis_port] || ENV["REDIS_PORT"]
          end

          def redis_database_default
            options[:redis_database] || ENV["REDIS_DATABASE"]
          end

          def dockerized_default
            options[:defaults] == "docker" ? "Y" : "N"
          end

          def collect_env_info
            collect_docker_info

            @server_port = ask_prompt("Port?", server_port_default)

            collect_database_info
            collect_redis_info
          end

          def collect_docker_info
            @dockerized = %w[y Y].include?(ask_prompt("Run with docker?", dockerized_default))

            return unless dockerized

            @db_host = "db"
            @db_user = "postgres"
            @db_password = "password"
            @db_port = 5432
            @redis_host = "redis"
            @redis_port = 6379
            @redis_database = 0

            puts <<~HERE
              The following docker configuration has been automatically set for you:
              Database host: #{db_host}
              Database port: #{db_port}
              Database user: #{db_user}
              Database password: #{db_password}
              Redis host: #{redis_host}
              Redis port: #{redis_port}
              Redis database: #{redis_database}
            HERE
          end

          def collect_database_info
            @db_name = ask_prompt("Database?", db_name_default)
            @db_host ||= ask_prompt("Database host?", db_host_default)
            @db_port ||= ask_prompt("Database port?", db_port_default)
            @db_user ||= ask_prompt("Database User?", db_user_default)
            @db_password ||= ask_prompt("Database Password?", db_password_default)

            nil
          end

          def collect_redis_info
            @redis_host ||= ask_prompt("Redis host?", redis_host_default)
            @redis_port ||= ask_prompt("Redis port?", redis_port_default)
            @redis_database ||= ask_prompt("Redis database?", redis_database_default)

            nil
          end

          def project_file(file)
            File.join(project_dir, file)
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
