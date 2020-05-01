# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveRecord
      module Describe
        extend ActiveSupport::Concern

        class_methods do
          def describe # rubocop:disable Metrics/AbcSize
            {
              model: model_name.singular,
              name: model_name.name.camelize(:lower),
              pluralName: model_name.name.camelize(:lower).pluralize,
              capitalizedName: model_name.name,
              capitalizedPluralName: model_name.name.pluralize,
              readableName: model_name.human,
              pluralReadableName: model_name.human.pluralize,
              ownedBy: owned_by,
              path: "#{Rhino.namespace}/#{route_path}",
              attributes: export_properties.map { |property| describe_property(property) }
            }
          end
        end
      end
    end
  end
end
