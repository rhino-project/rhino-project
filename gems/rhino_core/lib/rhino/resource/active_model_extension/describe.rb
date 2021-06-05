# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveModelExtension
      module Describe
        extend ActiveSupport::Concern

        class_methods do
          def describe # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
            properties = all_properties.index_with { |p| describe_property(p) }

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
                path: "#{Rhino.namespace}/#{route_path}"
              },
              type: :object,
              properties: properties,
              required: required
            }.compact
          end
        end
      end
    end
  end
end
