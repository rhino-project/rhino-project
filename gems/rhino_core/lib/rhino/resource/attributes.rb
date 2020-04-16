# frozen_string_literal: true

module Rhino
  module Resource
    module Attributes
      extend ActiveSupport::Concern

      included do
        delegate :readable_attributes, :writeable_attributes, :viewable_attributes, to: :class
        delegate :creatable_attributes, :updatable_attributes, to: :class
        delegate :describe_attribute, to: :class
      end

      class_methods do # rubocop:disable Metrics/BlockLength
        def identifier_attribute
          raise NotImplementedError, '#identifier_attribute is not implemented'
        end

        def readable_attributes
          raise NotImplementedError, '#readable_attributes is not implemented'
        end

        def writeable_attributes
          raise NotImplementedError, '#writeable_attributes is not implemented'
        end

        def describe_attribute
          raise NotImplementedError, '#describe_attribute is not implemented'
        end

        def viewable_attributes
          [readable_attributes, writeable_attributes].flatten.uniq
        end

        def creatable_attributes
          writeable_attributes
        end

        def updatable_attributes
          writeable_attributes
        end

        def transform_creatable_params(params)
          params
        end

        def transform_updatable_params(params)
          params
        end
      end
    end
  end
end
