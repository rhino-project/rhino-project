# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveModelExtension
      module Params
        extend ActiveSupport::Concern

        class_methods do # rubocop:todo Metrics/BlockLength
          def create_params
            writeable_params("create")
          end

          def show_params
            readable_params("show")
          end

          def update_params
            writeable_params("update")
          end

          protected
            def props_by_type(type)
              # FIXME: Direct attributes for this model we want a copy, not to
              # alter the class_attribute itself
              send("#{type}_properties").dup
            end

            # FIXME Refs are not handled
            def readable_params(_type, _refs = references)
              params = []
              props_by_type("read").each do |prop|
                desc = describe_property(prop)

                # Generic array of scalars
                next params << { prop => [] } if desc[:type] == :array

                # Otherwise prop and param are equivalent
                params << prop
              end

              # Display name is always allowed
              params << "display_name"
            end

            # FIXME Refs are not handled
            def writeable_params(type, _refs = references)
              params = []

              props_by_type(type).each do |prop|
                desc = describe_property(prop)

                # Generic array of scalars
                next params << { prop => [] } if desc[:type] == :array

                # Otherwise prop and param are equivalent
                # We also accept the ref name as the foreign key if its a singular resource
                params << prop
              end

              # Allow id in if its an update so we can find the original record
              params << identifier_property if type == "update"

              params
            end
        end
      end
    end
  end
end
