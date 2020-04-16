# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveRecord
      module Reference
        extend ActiveSupport::Concern

        included do
          def fetch_reference(name)
            ref = send(name)

            # Nothing if the related object does not exist
            # For instance, it might be optional
            return nil unless ref

            Rhino.resource_instance(ref)
          end
        end
      end
    end
  end
end
