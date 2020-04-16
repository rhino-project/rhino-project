# frozen_string_literal: true

module Rhino
  class BaseController < ActionController::API
    include DeviseTokenAuth::Concerns::SetUserByToken
    include Pundit

    # https://api.rubyonrails.org/classes/AbstractController/Base.html#method-c-abstract-21
    # Prevents the utility methods below from showing up as actions in RestController
    abstract!

    respond_to :json

    rescue_from Exception, with: :handle_uncaught_error
    around_action :catch_not_found
    around_action :catch_parameter_missing

    # FIXME: Should all pundit handling be in rest_controller?
    rescue_from Pundit::NotAuthorizedError do |_|
      forbidden
    end

    def catch_not_found
      yield
    rescue ActiveRecord::RecordNotFound
      render json: { errors: ['Not found.'] },
             status: :not_found
    end

    def catch_parameter_missing
      yield
    rescue ActionController::ParameterMissing => e
      render json: { errors: [e.message] },
             status: :bad_request
    end

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
