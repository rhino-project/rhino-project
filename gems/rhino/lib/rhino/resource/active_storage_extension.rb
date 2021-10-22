# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveStorageExtension
      extend ActiveSupport::Concern

      # Base
      include Rhino::Resource::ActiveRecordExtension unless Rhino.auto_include_active_record

      included do
        attribute :url

        rhino_policy :active_storage_attachment

        def url
          Rails.application.routes.url_helpers.rails_blob_url(self, only_path: false)
        end

        def display_name
          filename.to_s
        end
      end

      class_methods do
        def readable_properties
          super + ["signed_id"]
        end
      end

      def serializable_hash(options = nil)
        super(options).merge("signed_id" => signed_id)
      end
    end
  end
end
