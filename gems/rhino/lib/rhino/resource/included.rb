# frozen_string_literal: true

module Rhino
  module Resource
    module Included
      extend ActiveSupport::Concern

      included do
        class_attribute :included_models_except, default: []

        delegate :included_models, to: :class
      end

      class_methods do
        def rhino_included_models_except(name, **_options)
          # https://apidock.com/rails/Class/class_attribute
          # 'This matches normal Ruby method inheritance: think of writing an attribute
          # on a subclass as overriding the reader method. However, you need to be aware
          # when using class_attribute with mutable structures as Array or Hash. In such
          # cases, you don't want to do changes in place. Instead use setters:'
          self.included_models_except += [name]
        end

        def includable_models
          raise NotImplementedError, '#includable_models is not implemented'
        end

        def included_models
          includable_models.except(*included_models_except)
        end
      end
    end
  end
end
