# frozen_string_literal: true

# Creates a new blob on the server side in anticipation of a direct-to-service upload from the client side.
# When the client-side upload is completed, the signed_blob_id can be submitted as part of the form to reference
# the blob that was created up front.

module Rhino
  class DirectUploadsController < ::ActiveStorage::DirectUploadsController
    include DeviseTokenAuth::Concerns::SetUserByToken
    include Pundit

    include Rhino::ErrorHandling

    after_action :verify_authorized

    def create
      authorize ActiveStorage::Attachment

      super
    end
  end
end
