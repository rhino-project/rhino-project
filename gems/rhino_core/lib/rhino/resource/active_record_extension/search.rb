# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveRecordExtension
      module Search
        extend ActiveSupport::Concern

        class_methods do
          def rhino_search(fields, associated_fields = {})
            include PgSearch::Model

            # stores the searchable fields so it is possible to retrieve them
            # in the open API model description
            @rhino_searchable_properties = fields
            # FIXME: We can't autodiscover text fields because it causes a very
            # slow reload in the development server with bigger apps
            pg_search_scope :search_text_fields, against: fields, associated_against: associated_fields, using: { tsearch: { prefix: true } }
          end
        end
      end
    end
  end
end
