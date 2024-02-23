# frozen_string_literal: true

require "rgl/implicit"
require "rgl/dot"

module Rhino
  class InfoGraph
    include Rhino::Resource

    rhino_owner_global

    rhino_routing only: [:index], path: "info/graph"
    rhino_controller :simple_stream
    rhino_policy :resource_info

    def self.describe
      nil
    end

    FILENAME = "rhino-resource-graph"
    FILETYPE = "png"

    def self.build_graph
      RGL::ImplicitGraph.new do |g|
        # Add every rhino resource
        g.vertex_iterator { |c| Rhino.resource_classes.each(&c) }

        # If its owned by another resoource, link it
        g.adjacent_iterator { |v, c| c.call(v.resource_owned_by.to_s.camelize.constantize) if v&.resource_owned_by && !v.global_owner? }

        g.directed = true
      end
    end

    def self.index
      build_graph.write_to_graphic_file(FILETYPE, FILENAME)

      { file: [FILENAME, FILETYPE].join("."), type: "image/png", disposition: "inline" }
    end
  end
end
