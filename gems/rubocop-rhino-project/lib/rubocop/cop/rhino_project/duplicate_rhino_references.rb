# frozen_string_literal: true

module RuboCop
  module Cop
    module RhinoProject
      # Don't call `rhino_references` method more than once in the same class.
      #
      #
      # @example
      #   # bad
      #   class Blog < ApplicationRecord
      #     belongs_to :user
      #     belongs_to :category
      #
      #     rhino_references %i[user]
      #     rhino_references %i[user category]
      #   end
      #
      #   # good
      #   class Blog < ApplicationRecord
      #     belongs_to :user
      #     belongs_to :category
      #
      #     rhino_references %i[user category]
      #   end
      #
      class DuplicateRhinoReferences < Base
        MSG = "Avoid calling `rhino_references` method more than once in the same class."

        def_node_search :rhino_references_call, "(send nil? :rhino_references (array ...))"

        def on_class(node)
          check_for_multiple_calls(node)
        end

        private
          def check_for_multiple_calls(node)
            rhino_references_calls = rhino_references_call(node)

            return if rhino_references_calls.count <= 1

            rhino_references_calls.each do |offending_call|
              add_offense(offending_call, message: MSG)
            end
          end
      end
    end
  end
end
