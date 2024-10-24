# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveRecordExtension
      module Owner
        extend ActiveSupport::Concern

        # The self is actually required to work with class_attribute properly
        class_methods do
          def owner_class
            reflect_on_association(resource_owned_by).klass
          end

          # Test if rhino_owner[rdoc-ref:rhino_owner] is the global owner
          # Also available on the instance
          def global_owned?
            chained_scope = self
            while !chained_scope.auth_owner? && !chained_scope.base_owner? && !chained_scope.global_owner?
              chained_scope = chained_scope.owner_class
            end

            chained_scope.global_owner?
          end

          private
            def simple_joins_for(parent)
              # FIXME: There is probably a more rubyish way to do this
              chained_scope = self
              joins = []

              # The ownership could be a many, so we classify first
              while chained_scope.owner_class.name != parent.to_s.classify
                joins << chained_scope.resource_owned_by
                chained_scope = chained_scope.owner_class
              end
              joins << chained_scope.resource_owned_by

              joins.reverse
            end
        end
      end
    end
  end
end
