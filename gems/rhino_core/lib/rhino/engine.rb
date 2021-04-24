# frozen_string_literal: true

module Rhino
  class Engine < ::Rails::Engine
    initializer 'rhino.active_record_extension' do
      ActiveSupport.on_load(:active_record) do
        require_relative 'resource/active_record_extension'
        require_relative 'resource/active_record_tree'

        include Rhino::Resource::ActiveRecordExtension if Rhino.auto_include_active_record
      end
    end

    initializer 'rhino.active_storage_extension' do
      ActiveSupport.on_load(:active_storage_attachment) do
        require_relative 'resource/active_storage_extension'

        include Rhino::Resource::ActiveStorageExtension
      end
    end

    initializer 'rhino.check_resources' do
      config.after_initialize do
        check_resources
      end
    end

    initializer 'rhino.resource_reloader' do
      config.after_initialize do
        Rails.application.reloader.to_prepare do
          Rhino.resource_classes = nil
        end
      end
    end

    initializer 'rhino.register_module' do
      config.after_initialize do
        Rhino.registered_modules[:rhino] = {
          version: Rhino::VERSION,
          authOwner: Rhino.auth_owner.model_name.singular,
          baseOwner: Rhino.base_owner.model_name.singular,
          oauth: Rhino::OmniauthHelper.strategies
        }
      end
    end

    def top_level_references(resource)
      # Handle things like rhino_references [{ blog_post: [:blog] }]
      # Just check the top level ones for now
      resource.references.flat_map { |ref| ref.is_a?(Hash) ? ref.keys : ref }
    end

    def unowned?(resource)
      # Special case
      return true if resource.ancestors.include?(Rhino::Resource::ActiveStorageExtension)

      # Owners are not themselves owned
      resource.auth_owner? || resource.base_owner? || resource.global_owner?
    end

    def check_owner_reflections
      raise "#{Rhino.base_owner} must have reflection for #{Rhino.auth_owner}" if Rhino.base_to_auth.nil?

      raise "#{Rhino.auth_owner} must have reflection for #{Rhino.base_owner}" if Rhino.auth_to_base.nil?
    end

    def check_ownership(resource)
      return if unowned?(resource)

      raise "#{resource} does not have rhino ownership set" unless resource.resource_owned_by.present?
    end

    def check_references(resource)
      # Some resource types don't have reflections
      top_level_reflections = resource.try(:reflections)&.keys&.map(&:to_sym) || []

      # All references should have a reflection
      delta = top_level_references(resource) - top_level_reflections

      raise "#{resource} has references #{delta} that do not exist as associations" if delta.present?
    end

    def check_owner_reference(resource)
      return if unowned?(resource)

      # If its in the list, we're good
      return if top_level_references(resource).include?(resource.resource_owned_by)

      raise "#{resource} does not have a reference to its owner #{resource.resource_owned_by}"
    end

    def check_resources
      check_owner_reflections

      Rhino.resource_classes.each do |resource|
        check_ownership(resource)
        check_references(resource)
        check_owner_reference(resource)
      end
    end
  end
end
