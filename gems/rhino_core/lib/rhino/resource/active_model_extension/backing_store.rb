# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveModelExtension
      module BackingStore
        extend ActiveSupport::Concern

        def backing_store_update
          raise NotImplementedError, "#update is not implemented for BackingStore"
        end

        def backing_store_destroy
          raise NotImplementedError, "#destroy is not implemented for BackingStore"
        end

        class_methods do
          def backing_store_create
            raise NotImplementedError, "#create is not implemented for BackingStore"
          end

          def backing_store_index
            raise NotImplementedError, "#index is not implemented for BackingStore"
          end

          def backing_store_show
            raise NotImplementedError, "#show is not implemented for BackingStore"
          end
        end
      end
    end
  end
end
