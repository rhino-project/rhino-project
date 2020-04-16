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
      JSON.pretty_generate(Rhino.resources.map(&:describe))
    end
  end
end
