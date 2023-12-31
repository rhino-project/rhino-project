# frozen_string_literal: true

module Rhino
  module ErrorHandling
    extend ActiveSupport::Concern

    included do # rubocop:disable Metrics/BlockLength
      rescue_from Exception, with: :handle_uncaught_error

      # ActiveRecord::DeleteRestrictionError is for dependent: :restrict_with_exception
      rescue_from ActionController::ParameterMissing, ActiveRecord::DeleteRestrictionError do |e|
        render json: { errors: [e.message] }, status: :bad_request
      end

      rescue_from Pundit::NotAuthorizedError, with: :forbidden

      # ActiveRecord::RecordNotDestroyed is for dependent: :restrict_with_error
      rescue_from ActiveRecord::RecordInvalid, ActiveRecord::RecordNotDestroyed do |e|
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
          errors: (errors || ['Unprocessable request.'])
        }, status: :unprocessable_entity
      end

      def cors
        render json: {}
      end
    end
  end
end
