# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveStorage
      extend ActiveSupport::Concern

      # Base
      include Rhino::Resource::ActiveRecord

      included do
        attribute :url

        def url
          Rails.application.routes.url_helpers.rails_blob_url(self)
        end

        def display_name
          filename
        end
      end
    end
  end
end
