# frozen_string_literal: true

module Rhino
  module Resource
    # == Rhino \Resource \Properties
    #
    # Provides a way to control what properties are exposed on resources as well
    # as an interface for resource implementations to implement and existence
    # utilities.
    #
    # Read, create and update properties can be constrained with only and except
    # directives:
    #
    #   class User
    #     include ActiveModel::AttributeMethods
    #
    #     rhino_properties_read except: :password
    #     rhino_properties_create only: [:email]
    #     rhino_properties_update only: [:name]
    #   end
    #
    # rdoc-ref:rhino_properties_write constrains both create and update.
    #
    # Resource implementations need to implement the following methods:
    #   identifier_property
    #   readable_properties
    #   creatable_properties
    #   updatable_properties
    module Properties # rubocop:todo Metrics/ModuleLength
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

        class_attribute :_all_properties, default: nil

        class_attribute :_properties_overrides, default: ActiveSupport::HashWithIndifferentAccess.new
        class_attribute :_properties_array, default: {}

        delegate :identifier_property, to: :class
        delegate :read_properties, :create_properties, :update_properties, to: :class
        delegate :all_properties, to: :class

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

        # Constrain create and update properties
        # Accepts only: and except: as either a single property or an array of
        # properties
        def rhino_properties_write(...)
          rhino_properties_create(...)
          rhino_properties_update(...)
        end

        def rhino_properties_format(formats)
          formats.each do |property, format|
            self._properties_overrides = self._properties_overrides.deep_merge(property => { format: })
          end
        end

        def rhino_properties_readable_name(readable_names)
          readable_names.each do |property, readable_name|
            self._properties_overrides = self._properties_overrides.deep_merge(property => { "x-rhino-attribute": { readableName: readable_name } })
          end
        end

        def rhino_properties_array(options)
          self._properties_array = options
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

        # Return list of read properties for the resource (show and index)
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

        # Check if read property exists
        def read_property?(property)
          read_properties.include?(property)
        end

        # Return list of create properties for the resource
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

        # Check if create property exists
        def create_property?(property)
          create_properties.include?(property)
        end

        # Return list of update properties for the resource
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

        # Check if update property exists
        def update_property?(property)
          update_properties.include?(property)
        end

        def all_properties
          self._all_properties = (read_properties + create_properties + update_properties).uniq.map(&:to_s) unless self._all_properties

          self._all_properties
        end

        # Check if property exists
        def property?(property)
          all_properties.include?(property)
        end

        def describe_property(property)
          raise NotImplementedError, "#describe_property is not implemented for #{property}"
        end
      end
      # rubocop:enable Style/RedundantSelf
    end
  end
end
