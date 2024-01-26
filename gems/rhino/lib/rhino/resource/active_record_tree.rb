# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveRecordTree
      extend ActiveSupport::Concern

      # Base
      include Rhino::Resource::ActiveRecordExtension unless Rhino.auto_include_active_record

      included do
        has_ancestry
      end

      class_methods do
        def readable_properties
          super + ["children"]
        end

        def describe_property(property)
          return super unless property == "children"

          super.deep_merge({ type: :array, items: ref_descriptor([model_name.element]) })
        end

        # FIXME: Need to recurse to a MAX DEPTH
        def readable_params(type, refs = references)
          # Remove the base children property and replace with hash
          base_show = super - ["children"]
          base_show + [children: [base_show]]
        end

        # FIXME: Need writeable params override
      end

      def serializable_hash(options = nil)
        super(options).merge(children: arrange_serializable_with_options(options))
      end

      private
        # We do this to carry things like methods all the way through the
        # serialization
        def arrange_serializable_with_options(options = nil)
          children.arrange_serializable do |parent, _children|
            parent.serializable_hash(options)
          end
        end
    end
  end
end
