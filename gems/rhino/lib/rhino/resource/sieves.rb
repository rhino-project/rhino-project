# frozen_string_literal: true

module Rhino
  module Resource
    module Sieves
      extend ActiveSupport::Concern

      included do
        class_attribute :_sieves
        class_attribute :_built_sieves

        delegate :sieves, to: :class
      end

      # rubocop:disable Style/RedundantSelf
      class_methods do
        def rhino_sieves
          self._sieves = Rhino.sieves.dup unless self._sieves
          self._sieves
        end

        def sieves
          self._built_sieves = rhino_sieves.build(self) unless self._built_sieves

          self._built_sieves
        end

        def resolve(scope, _params)
          scope
        end
      end
      # rubocop:enable Style/RedundantSelf
    end
  end
end
