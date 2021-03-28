# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveStorageExtension
      extend ActiveSupport::Concern

      # Base
      include Rhino::Resource::ActiveRecordExtension unless Rhino.auto_include_active_record

      included do
        attribute :url

        rhino_policy :active_storage_upload

        def url
          Rails.application.routes.url_helpers.rails_blob_url(self, only_path: false)
        end

        def display_name
          filename.to_s
        end
      end
    end
  end
end
