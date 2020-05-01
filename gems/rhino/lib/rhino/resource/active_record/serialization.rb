# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveRecord
      module Serialization
        extend ActiveSupport::Concern

        included do
          def to_caching_json(current_user)
            hash = serializable_hash(
              only: read_properties.map(&:to_sym),
              include: references_for_serialization,
              methods: [:display_name]
            )

            hash[:can_current_user_edit] = Pundit.policy(current_user, self).update?

            hash
            # JSON.generate(hash)
          end
        end
      end
    end
  end
end
