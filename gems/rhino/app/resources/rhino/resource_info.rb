# frozen_string_literal: true

module Rhino
  class ResourceInfo
    include Rhino::Resource

    rhino_owner_global

    rhino_routing only: [:index], path: 'info/models'
    rhino_controller :simple
    rhino_policy :none

    def self.describe
      ''
    end

    def self.index
      JSON.pretty_generate({
        components: {
          schemas: Rhino.resources.map(&:describe)
        },
        info: describe_info
      })
    end

    def self.describe_info
      {
        'x-rhino-info': {
          version: Rhino::VERSION,
          authOwner: Rhino.auth_owner.model_name.singular,
          baseOwner: Rhino.base_owner.model_name.singular,
          modules: {
          }
        }
      }
    end
  end
end
