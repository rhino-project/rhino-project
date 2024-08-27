# frozen_string_literal: true

require "active_record/associations/nested_error"

module ActiveRecord
  module Associations
    class NestedError < ::ActiveModel::NestedError
      private
        def compute_attribute(inner_error)
          association_name = association.reflection.name

          # Dot notation is used to represent nested attributes in the error message.
          if index_errors_setting && index
            "#{association_name}.#{index}.#{inner_error.attribute}".to_sym
          else
            "#{association_name}.#{inner_error.attribute}".to_sym
          end
        end
    end
  end
end
