# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveRecord
      module Included
        extend ActiveSupport::Concern

        class_methods do
          def includable_models
            # FIXME: Remove polymorphic relationships, not handled yet
            includables = reflections.reject { |_name, reflection| reflection.polymorphic? }

            includables = includables.each_with_object({}) do |(name, reflection), hash|
              hash[name] = {
                klass: Rhino.resource_by_association(reflection),
                macro: reflection.macro,
                nullable: reflection.options[:optional] || false,
                default: default?(name, reflection)
              }

              hash
            end

            includables.with_indifferent_access
          end

          private

          def default?(name, reflection)
            !reflection.through_reflection? &&
              (reflection.macro == :belongs_to ||
                nested_attributes_options.key?(name.to_sym))
          end
        end
      end
    end
  end
end
