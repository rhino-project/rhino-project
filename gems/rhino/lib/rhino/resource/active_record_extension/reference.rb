# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveRecordExtension
      module Reference
        extend ActiveSupport::Concern

        included do
          scope :eager_load_refs, -> { includes(klass.references) } if defined?(scope)

          def references_for_serialization
            serialize_references(references)
          end

          private

          # FIXME: Duplicated in params.rb
          def reference_to_sym(reference)
            reference.is_a?(Hash) ? reference.keys.first : reference
          end

          # FIXME: Duplicated in params.rb
          def reference_from_sym(sym)
            ref = try(sym)
            return unless ref

            # This is mostly how serializable_hash does it
            # Get the first object
            return ref.first if ref.respond_to?(:to_ary)

            ref
          end

          def serialize_references(references)
            hash = {}
            references.each do |ref_item|
              sym = reference_to_sym(ref_item)

              hash[sym] = {}
              hash[sym][:methods] = :display_name
              hash[sym][:include] = serialize_references(ref_item[sym]) if ref_item.is_a?(Hash)
            end.flatten.compact

            hash
          end
        end
      end
    end
  end
end
