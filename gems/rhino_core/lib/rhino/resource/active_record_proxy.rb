# frozen_string_literal: true

module Rhino
  module Resource
    class ActiveRecordProxy
      # Base
      include Rhino::Resource::ActiveRecord

      # FIXME: This class should be abstract and the following should be set in the
      # descendant
      class_attribute :active_record_class, default: ActiveStorage::Attachment

      attr_reader :active_record

      rhino_owner_global

      rhino_included_models_except :record
      rhino_included_models_except :blob

      # Init this specific instance
      def initialize(active_record)
        @active_record = active_record
      end

      # Overrides specific to ActiveStorage::Attachment
      def display_name
        active_record.filename.to_s
      end

      def url
        Rails.application.routes.url_helpers.rails_blob_url(active_record)
      end

      def self.readable_attributes
        %i[filename url]
      end

      def self.writeable_attributes
        []
      end

      # Assume the missing methods should go to the active record
      def method_missing(method, *args)
        return @active_record.send(method, *args) if respond_to?(method, true)

        super
      end

      def respond_to_missing?(method_name, include_private = false)
        @active_record.respond_to?(method_name, include_private) || super
      end

      def self.method_missing(method, *args)
        return active_record_class.send(method, *args) if respond_to?(method, true)

        super
      end

      def self.respond_to_missing?(method_name, include_private = false)
        active_record_class.respond_to?(method_name, include_private) || super
      end
    end
  end
end
