# frozen_string_literal: true

module Rhino
  class BaseController < ActionController::API
    include ActionController::Cookies
    include DeviseTokenAuth::Concerns::SetUserByToken
    include Pundit

    include Rhino::ErrorHandling
    include Rhino::SetCurrentUser
    include Rhino::PaperTrailWhodunnit

    # https://api.rubyonrails.org/classes/AbstractController/Base.html#method-c-abstract-21
    # Prevents the utility methods below from showing up as actions in CrudController
    abstract!

    respond_to :json

    def klass
      @klass ||= params.delete(:rhino_resource).constantize
    end
  end
end
