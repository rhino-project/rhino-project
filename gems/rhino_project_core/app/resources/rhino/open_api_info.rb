# frozen_string_literal: true

module Rhino
  class OpenApiInfo
    include Rhino::Resource

    rhino_owner_global

    rhino_routing only: [:index], path: 'info/openapi'
    rhino_controller :simple
    rhino_policy :resource_info

    def self.describe
      nil
    end

    def self.index
      JSON.pretty_generate({
        openapi: '3.0.3',
        components: {
          schemas: describe_schemas
        },
        paths: describe_paths,
        info: describe_info
      })
    end

    def self.describe_schemas
      Rhino.resource_classes.index_with(&:describe).compact.transform_keys { |r| r.model_name.singular }
    end

    def self.describe_parameter(param)
      {
        name: param,
        in: "path",
        required: true
      }
    end

    # https://gist.github.com/bantic/5688232#gistcomment-3274704
    RESPONSE_CODES = [200, 400, 403, 422].freeze
    SUCCESS_CODES = [200].freeze
    def self.describe_path_content(klass, code)
      {
        "application/json":
          ({ schema: { "$ref": "#/components/schemas/#{klass.model_name.singular}" } } if SUCCESS_CODES.include?(code)) || {}
      }
    end

    def self.describe_path_responses(klass)
      RESPONSE_CODES.index_with do |code|
        {
          description: Rack::Utils::HTTP_STATUS_CODES[code],
          content: describe_path_content(klass, code)
        }
      end
    end

    def self.describe_path(path) # rubocop:todo Metrics/AbcSize
      new_path = path.index_by { |p| p[:verb].downcase.to_sym }
      new_path.transform_values! do |verb_values|
        klass = verb_values[:rhino_resource].constantize

        verb_info = {
          operationId: "#{klass.model_name.singular}-#{verb_values[:action]}",
          parameters: verb_values[:required_names].map { |param| describe_parameter(param) },
          responses: describe_path_responses(klass),
          tags: [klass.model_name.singular]
        }

        verb_info
      end

      new_path
    end

    PATH_IGNORES = ["Rhino::OpenApiInfo", "Rhino::InfoGraph", "Rhino::DevAi"].freeze
    def self.describe_paths # rubocop:todo Metrics/AbcSize
      routes = Rails.application.routes.routes

      # Extract the path information we need
      paths = routes.map { |r| r.defaults.merge(verb: r.verb, path: r.path.spec.to_s, required_names: r.path.required_names) }
      paths = paths.group_by { |r| r[:path] }

      # Get rid of non-rhino paths
      # Rhino paths have rhino_resource set as an attribute when the routes are created
      paths.transform_values! { |v| v.select { |p| p[:rhino_resource].present? && PATH_IGNORES.exclude?(p[:rhino_resource]) } }

      # Remove empty hashes
      paths.compact_blank!

      # For each path, list the verbs it supports
      paths.transform_values! do |path|
        describe_path(path)
      end
    end

    def self.describe_info
      {
        title: "#{Rails.application.class.module_parent_name} API",
        version: '0.0.0',
        "x-rhino": {
          modules: Rhino.registered_modules
        }
      }
    end
  end
end
