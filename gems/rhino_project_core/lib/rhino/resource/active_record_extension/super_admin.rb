# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveRecordExtension
      module SuperAdmin
        extend ActiveSupport::Concern

        class_methods do
          def ransackable_attributes(_auth_object = nil)
            authorizable_ransackable_attributes & read_properties
          end

          def ransackable_associations(_auth_object = nil)
            authorizable_ransackable_associations & references
          end

          def ransackable_filters(auth_object = nil)
            ransackable_attributes(auth_object) + ransackable_associations
          end
        end
      end
    end
  end
end
