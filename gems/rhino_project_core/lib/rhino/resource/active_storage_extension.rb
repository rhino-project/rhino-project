# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveStorageExtension
      extend ActiveSupport::Concern

      # Base
      include Rhino::Resource::ActiveRecordExtension unless Rhino.auto_include_active_record

      included do
        attribute :url
        attribute :url_attachment
        attribute :variants, :json, default: {}

        rhino_policy :active_storage_attachment

        def url(attachment = self, **options)
          Rails.application.routes.url_helpers.rails_blob_url(attachment, only_path: false, **options)
        end

        def url_attachment(attachment = self)
          url(attachment, disposition: :attachment)
        end

        def variants
          # Not everything may be processed into a variant based on mime type
          return unless variable?

          record.attachment_reflections[self.name]&.named_variants&.keys&.index_with do |v|
            variant = variant(v)

            {
               url: url(variant),
               url_attachment: url_attachment(variant)
            }
          end
        end

        def display_name
          filename.to_s
        end
      end

      class_methods do
        def readable_properties
          super + [ "variants", "signed_id"]
        end
      end

      def serializable_hash(options = nil)
        super(options).merge("signed_id" => signed_id)
      end
    end
  end
end
