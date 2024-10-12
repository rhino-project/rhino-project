# frozen_string_literal: true

require "parser/current"
module RuboCop
  module Cop
    module RhinoProject
      # Call `rhino_owner`, `rhino_owner_base` or `rhino_owner_global` for the model class.
      #
      #
      # @example
      #   # bad
      #   class Blog < ApplicationRecord
      #     belongs_to :user
      #     belongs_to :category
      #
      #     rhino_references %i[user]
      #   end
      #
      #   # good
      #   class Blog < ApplicationRecord
      #     belongs_to :user
      #     belongs_to :category
      #
      #     rhino_owner :user
      #     rhino_references %i[user category]
      #   end
      #
      class OwnerSpecified < Cop
        MSG = "ActiveRecord models listed in rhino.rb must specify exactly one ownership method (rhino_owner_global, rhino_owner_reference, or rhino_owner :symbol)."

        REQUIRED_METHODS = [:rhino_owner_global, :rhino_owner_base, :rhino_owner].freeze

        def investigate(processed_source)
          return unless applicable_model?(processed_source)

          class_node = find_class_node(processed_source.ast)
          return unless class_node

          method_calls = find_rhino_owner_calls(class_node)

          if method_calls.size != 1
            add_offense(class_node, message: MSG)
          end
        end

        private
          def applicable_model?(processed_source)
            model_name = extract_class_name(processed_source)

            return false if inherits_from_rhino?(processed_source)

            rhino_resources.include?(model_name)
          end

          def extract_class_name(processed_source)
            class_node = find_class_node(processed_source.ast)
            return unless class_node

            class_name_node = class_node.children[0]
            class_name_node.const_name
          end

          def find_rhino_owner_calls(class_node)
            # Search only within the class body for Rhino ownership method calls
            body_node = class_node.children[2]
            find_descendants(body_node).select do |send_node|
              send_node.type == :send && REQUIRED_METHODS.include?(send_node.children[1])
            end
          end

          def find_class_node(ast)
            find_descendants(ast).find { |node| node.type == :class }
          end

          # Check if the class inherits from a Rhino:: class
          def inherits_from_rhino?(processed_source)
            class_node = find_class_node(processed_source.ast)
            return false unless class_node

            superclass_node = class_node.children[1]
            return false unless superclass_node

            superclass_name = superclass_node.const_name
            superclass_name&.start_with?("Rhino::")
          end

          def rhino_resources
            @rhino_resources ||= read_rhino_resources
          end

          def read_rhino_resources
            rhino_initializer_path = File.join(Dir.pwd, "config", "initializers", "rhino.rb")
            return [] unless File.exist?(rhino_initializer_path)

            rhino_initializer_content = File.read(rhino_initializer_path)
            ast = Parser::CurrentRuby.parse(rhino_initializer_content)
            parse_rhino_resources(ast)
          end

          # Parse the rhino.rb AST and extract the resources added to config.resources
          def parse_rhino_resources(ast)
            resources = []

            find_resources_assignments(ast).each do |assignment_node|
              next unless assignment_node

              # Looking for array elements in `config.resources += [...]`
              array_node = assignment_node.children[2] # Accessing the right-hand side of `+=`
              if array_node&.type == :array
                resources.concat(array_node.children.map { |node| extract_string(node) })
              end
            end

            resources.compact
          end

          # Now looking for `op_asgn` nodes that represent `config.resources += [...]`
          def find_resources_assignments(ast)
            find_descendants(ast).select do |node|
              node.type == :op_asgn && node.children[1] == :+
            end
          end

          def extract_string(node)
            return unless node.type == :str

            node.children[0]
          end

          # Custom method to recursively find descendants in a generic AST node (Parser or RuboCop)
          def find_descendants(node, &block)
            return [] unless node.is_a?(Parser::AST::Node)

            results = [node]
            node.children.each do |child|
              next unless child.is_a?(Parser::AST::Node)

              results.concat(find_descendants(child, &block))
            end
            results
          end
      end
    end
  end
end
