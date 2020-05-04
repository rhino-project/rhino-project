# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveRecord
      module Reference
        extend ActiveSupport::Concern

        included do
          scope :eager_load_refs, -> { includes(klass.references) } if defined?(scope)
        end

        class_methods do
          def references_for_serialization
            serialize_references(references)
          end

          private

          def serialize_references(references, parent = self) # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
            hash = {}
            references.each do |ref_item|
              ref_name = if ref_item.is_a?(Hash)
                           ref_item.keys.first
                         else
                           ref_item
                         end

              ref = parent.reflect_on_association(ref_name)&.klass

              hash[ref_name] = {}
              hash[ref_name][:only] = ref.read_properties
              hash[ref_name][:include] = serialize_references(ref_item[ref_name], ref) if ref_item.is_a?(Hash)
              hash[ref_name][:methods] = [:display_name]
            end.flatten.compact

            hash
          end
        end
      end
    end
  end
end
