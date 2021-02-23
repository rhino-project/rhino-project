# frozen_string_literal: true

module Rhino
  class BaseController < ActionController::API
    include DeviseTokenAuth::Concerns::SetUserByToken
    include Pundit

    include Rhino::SetCurrentUser

    # https://api.rubyonrails.org/classes/AbstractController/Base.html#method-c-abstract-21
    # Prevents the utility methods below from showing up as actions in CrudController
    abstract!

    respond_to :json

    rescue_from Exception, with: :handle_uncaught_error

    rescue_from ActionController::ParameterMissing do |e|
      render json: { errors: [e.message] },
             status: :bad_request
    end

    # FIXME: Should all pundit handling be in crud_controller?
    rescue_from Pundit::NotAuthorizedError, with: :forbidden

    rescue_from ActiveRecord::RecordInvalid do |e|
      unprocessable e.record.errors
    end
    rescue_from ActiveRecord::RecordNotFound, with: :not_found

    def handle_uncaught_error(exception)
      logger.info('Internal server error' +
                  exception.class.to_s + ' ' +
                  exception.message + ' ' +
                  exception.backtrace.join("\n"))
      render json: { errors: ['Internal server error.'] },
             status: :internal_server_error
    end

    def not_found
      render json: { errors: ['Not found.'] },
             status: :not_found
    end

    def bad_request(errors = nil)
      render json: { errors: (errors || ['Bad request.']) },
             status: :bad_request
    end

    def forbidden
      render json: { errors: ['Access denied.'] },
             status: :forbidden
    end

    def unprocessable(errors = nil)
      render json: {
        errors: (errors || ['Unprocessable request.'])
      }, status: :unprocessable_entity
    end

    def cors
      render json: {}
    end

    def klass
      @klass ||= params.delete(:rhino_resource).constantize
    end
  end
end
