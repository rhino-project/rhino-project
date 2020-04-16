# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveRecord
      module Included
        extend ActiveSupport::Concern

        class_methods do
          def includable_models
            # Remove through relationships and has_many that are not nested
            # FIXME Handle specific included has_many models
            # FIXME Handle specific excluded models
            includables = reflections.reject { |name, reflection| includable_filter(name, reflection) }

            includables = includables.each_with_object({}) do |(name, reflection), hash|
              hash[name] = {
                klass: Rhino.resource_by_association(reflection),
                macro: reflection.macro,
                nullable: reflection.options[:optional] || false
              }

              hash
            end

            includables.with_indifferent_access
          end

          private

          def includable_filter(name, reflection)
            reflection.through_reflection? ||
              reflection.polymorphic? ||
              (reflection.macro == :has_many && !nested_attributes_options.key?(name.to_sym))
          end
        end
      end
    end
  end
end
