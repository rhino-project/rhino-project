# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveRecordExtension
      module Serialization
        extend ActiveSupport::Concern

        def to_caching_json
          serializable_hash(methods: :display_name, include: references_for_serialization)
          # JSON.generate(hash)
        end
      end
    end
  end
end
