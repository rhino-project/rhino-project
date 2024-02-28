# frozen_string_literal: true

module Rhino
  class UsersRoleInviteController < CrudController
    def create
      @model = authorize klass.new(permit_and_transform(klass))
      user = ::User.find_by(email: params[:email])
      ::User.invite!(email: params[:email]) if user.nil?
      @model.save!

      permit_and_render
    end
  end
end
