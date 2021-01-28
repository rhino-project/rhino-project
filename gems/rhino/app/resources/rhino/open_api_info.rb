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
      schemas = Rhino.resource_classes.index_with(&:describe).compact.transform_keys { |r| r.model_name.singular }
      JSON.pretty_generate({
        openapi: '3.0.3',
        components: {
          schemas: schemas
        },
        paths: {
        },
        info: describe_info
      })
    end

    def self.describe_info
      {
        title: "#{Rails.application.class.module_parent_name} API",
        version: '0.0.0',
        'x-rhino-info': {
          version: Rhino::VERSION,
          authOwner: Rhino.auth_owner.model_name.singular,
          baseOwner: Rhino.base_owner.model_name.singular,
          oauth: Rhino::OmniauthHelper.strategies,
          modules: {}
        }
      }
    end
  end
end
