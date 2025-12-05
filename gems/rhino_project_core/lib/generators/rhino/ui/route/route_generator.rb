# frozen_string_literal: true

module Rhino
  module Generators
    module Ui
      class RouteGenerator < ::Rails::Generators::NamedBase
        class_option :routes_directory, type: :string, desc: "The directory to copy the routes to",
          default: "app/frontend/routes", group: :route
        class_option :route_path, type: :string, desc: "The path to routes relative to the routes directory", default: "_authenticated/$owner", group: :route
        class_option :model_path, type: :string, desc: "The base path name for the model (defaults to model plural name)", group: :route
        class_option :copy_index, type: :boolean, desc: "Copy the index route", default: true, group: :route
        class_option :copy_show, type: :boolean, desc: "Copy the show route", default: true, group: :route
        class_option :copy_create, type: :boolean, desc: "Copy the create route", default: true, group: :route
        class_option :copy_edit, type: :boolean, desc: "Copy the edit route", default: true, group: :route

        source_root File.expand_path("templates", __dir__)

        def copy_index_route
          return unless options.copy_index?
          template "index.tsx", route_file_path("index.tsx")
        end

        def copy_show_route
          return unless options.copy_show?
          template "$id.index.tsx", route_file_path("$id.index.tsx")
        end

        def copy_create_route
          return unless options.copy_create?
          template "new.tsx", route_file_path("new.tsx")
        end

        def copy_edit_route
          return unless options.copy_edit?
          template "$id.edit.tsx", route_file_path("$id.edit.tsx")
        end

        private
          def model_path
            options[:model_path] || plural_table_name
          end

          def route_path
            File.join("/", options[:route_path], model_path, "/")
          end


          def route_file_path(file_name)
            File.join(options[:routes_directory], options[:route_path], model_path, file_name)
          end
      end
    end
  end
end
