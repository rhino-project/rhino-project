# frozen_string_literal: true

module Rhino
  class Engine < ::Rails::Engine
    config.autoload_paths << File.expand_path('../../lib', __dir__)
    config.autoload_paths << File.expand_path('../../app/resources', __dir__)

    ActiveSupport.on_load(:active_record) do
      include Rhino::Resource::ActiveRecordExtension if Rhino.auto_include_active_record
    end

    ActiveSupport.on_load(:active_storage_attachment) do
      include Rhino::Resource::ActiveStorageExtension
    end

    config.after_initialize do
      raise NotImplementedError, "#{Rhino.base_owner} must have reflection for #{Rhino.auth_owner}" if Rhino.base_to_auth.nil?

      raise NotImplementedError, "#{Rhino.auth_owner} must have reflection for #{Rhino.base_owner}" if Rhino.auth_to_base.nil?

      Rhino.resource_classes.each do |resource|
        raise NotImplementedError, "#{resource} does not have rhino ownership set" unless check_ownership(resource)
      end

      Rails.application.reloader.to_prepare do
        Rhino.resource_classes = nil
      end
    end

    def self.check_ownership(resource)
      # Special case
      return true if resource.ancestors.include?(Rhino::Resource::ActiveStorageExtension)

      resource.auth_owner? || resource.base_owner? || resource.resource_owned_by.present?
    end
  end
end
