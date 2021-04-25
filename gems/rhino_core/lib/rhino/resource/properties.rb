# frozen_string_literal: true

module Rhino
  module Resource
    module Properties
      extend ActiveSupport::Concern

      included do
        class_attribute :_read_properties, default: nil
        class_attribute :_read_properties_only, default: nil
        class_attribute :_read_properties_except, default: []

        class_attribute :_create_properties, default: nil
        class_attribute :_create_properties_only, default: nil
        class_attribute :_create_properties_except, default: []

        class_attribute :_update_properties, default: nil
        class_attribute :_update_properties_only, default: nil
        class_attribute :_update_properties_except, default: []

        # delegate :readable_properties, :writeable_properties, to: :class
        delegate :identifier_property, to: :class
        delegate :read_properties, :create_properties, :update_properties, to: :class
        delegate :export_properties, to: :class

        # delegate :creatable_properties, :updatable_properties, to: :class
        delegate :describe_property, to: :class
      end

      # rubocop:disable Style/RedundantSelf
      class_methods do # rubocop:disable Metrics/BlockLength
        def rhino_properties_read(**options)
          self._read_properties_only = Array.wrap(options[:only]).map(&:to_s) if options.key?(:only)
          self._read_properties_except = Array.wrap(options[:except]).map(&:to_s) if options.key?(:except)
        end

        def rhino_properties_create(**options)
          self._create_properties_only = Array.wrap(options[:only]).map(&:to_s) if options.key?(:only)
          self._create_properties_except = Array.wrap(options[:except]).map(&:to_s) if options.key?(:except)
        end

        def rhino_properties_update(**options)
          self._update_properties_only = Array.wrap(options[:only]).map(&:to_s) if options.key?(:only)
          self._update_properties_except = Array.wrap(options[:except]).map(&:to_s) if options.key?(:except)
        end

        def rhino_properties_write(**options)
          rhino_properties_create(options)
          rhino_properties_update(options)
        end

        def identifier_property
          raise NotImplementedError, '#identifier_property is not implemented'
        end

        def readable_properties
          raise NotImplementedError, '#readable_properties is not implemented'
        end

        def creatable_properties
          raise NotImplementedError, '#creatable_properties is not implemented'
        end

        def updatable_properties
          raise NotImplementedError, '#updatable_properties is not implemented'
        end

        def read_properties
          # If :only was not set explicitly, select only the default includables
          # and extended models, leaving out the excepted models
          unless self._read_properties
            # If only was set, use that
            return self._read_properties_only if self._read_properties_only

            self._read_properties = readable_properties.select do |property|
              # And its not excepted
              self._read_properties_except.exclude?(property)
            end
          end

          self._read_properties
        end

        def create_properties
          unless self._create_properties
            # If create only was set, use that
            return self._create_properties_only if self._create_properties_only

            self._create_properties = creatable_properties.select do |property|
              self._create_properties_except.exclude?(property)
            end
          end

          self._create_properties
        end

        def update_properties
          unless self._update_properties
            # If update only was set, use that
            return self._update_properties_only if self._update_properties_only

            self._update_properties = updatable_properties.select do |property|
              self._update_properties_except.exclude?(property)
            end
          end

          self._update_properties
        end

        def describe_property
          raise NotImplementedError, '#describe_property is not implemented'
        end

        def export_properties
          [
            read_properties,
            create_properties,
            update_properties
          ].flatten.map(&:to_s).uniq
        end
      end
      # rubocop:enable Style/RedundantSelf
    end
  end
end
