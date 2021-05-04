# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveRecordExtension
      module Describe
        extend ActiveSupport::Concern

        class_methods do
          def describe # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
            properties = export_properties.index_with { |p| describe_property(p) }

            required = properties.reject { |_p, d| d[:nullable] || d[:readOnly] }.keys
            # required: [] is not valid and will be compacted away
            required = nil unless required.present?

            {
              "x-rhino-model": {
                model: model_name.singular,
                modelPlural: model_name.collection,
                name: model_name.name.camelize(:lower),
                pluralName: model_name.name.camelize(:lower).pluralize,
                readableName: model_name.human,
                pluralReadableName: model_name.human.pluralize,
                ownedBy: resource_owned_by,
                path: route_api,
                searchable: searchable?
              },
              type: :object,
              properties: properties,
              required: required
            }.compact
          end

          # returns true if the model's rhino_search is set with at least one field
          def searchable?
            @rhino_searchable_properties.present?
          end
        end
      end
    end
  end
end
