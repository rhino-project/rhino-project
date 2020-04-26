# frozen_string_literal: true

module Rhino
  module Resource
    module Included
      extend ActiveSupport::Concern

      included do
        class_attribute :_included_models, default: nil
        class_attribute :_included_models_only, default: nil
        class_attribute :_included_models_except, default: []
        class_attribute :_included_models_extend, default: []

        delegate :included_models, to: :class
      end

      # The self is actually required to work with class_attribute properly
      # rubocop:disable Style/RedundantSelf
      class_methods do
        def rhino_included_models(**options)
          self._included_models_only = options[:only].map(&:to_s) if options.key?(:only)
          self._included_models_except = options[:except].map(&:to_s) if options.key?(:except)
          self._included_models_extend = options[:extend].map(&:to_s) if options.key?(:extend)
        end

        def includable_models
          raise NotImplementedError, '#includable_models is not implemented'
        end

        def included_models
          # If :only was not set explicitly, select only the default includables
          # and extended models, leaving out the excepted models
          unless self._included_models
            # If only was set, use that
            return includable_models.slice(*self._included_models_only) if self._included_models_only

            self._included_models = includable_models.select do |name, included_model|
              # Its in the default set
              (included_model[:default] ||

                # Or its in the extended set
                self._included_models_extend.include?(name)) &&

                # And its not excepted
                self._included_models_except.exclude?(name)
            end
          end

          self._included_models
        end
      end
      # rubocop:enable Style/RedundantSelf
    end
  end
end
