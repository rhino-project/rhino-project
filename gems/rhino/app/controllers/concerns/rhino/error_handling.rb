# frozen_string_literal: true

module Rhino
  module ErrorHandling
    extend ActiveSupport::Concern

    included do # rubocop:disable Metrics/BlockLength
      rescue_from Exception, with: :handle_uncaught_error

      rescue_from ActionController::ParameterMissing do |e|
        render json: { errors: [e.message] }, status: :bad_request
      end

      rescue_from Pundit::NotAuthorizedError, with: :forbidden

      rescue_from ActiveRecord::RecordInvalid do |e|
        unprocessable e.record.errors
      end
      rescue_from ActiveRecord::RecordNotFound, with: :not_found

      def handle_uncaught_error(exception)
        # Send to rollbar if available
        Rollbar.error(exception) if defined? Rollbar

        logger.error("Internal server error#{exception.class} #{exception.message} #{exception.backtrace.join("\n")}")

        render json: { errors: ['Internal server error.'] },
               status: :internal_server_error
      end

      def not_found
        render json: { errors: ['Not found.'] }, status: :not_found
      end

      def bad_request(errors = nil)
        render json: { errors: (errors || ['Bad request.']) },
               status: :bad_request
      end

      def forbidden
        render json: { errors: ['Access denied.'] }, status: :forbidden
      end

      def unprocessable(errors = nil)
        render json: {
          errors: (errors&.to_hash(full_messages: true) || ['Unprocessable request.'])
        }, status: :unprocessable_entity
      end

      def cors
        render json: {}
      end
    end
  end
end
