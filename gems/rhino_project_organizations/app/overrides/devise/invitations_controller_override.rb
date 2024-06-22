# frozen_string_literal: true

class Devise::InvitationsController
  prepend_before_action :require_no_authentication, only: %i[update]
  before_action :configure_permitted_parameters

  # PUT /resource/invitation
  def update
    self.resource = accept_resource
    invitation_accepted = resource.errors.empty?

    if invitation_accepted
      actions_for_insecure_sign_in
      render json: { data: resource.token_validation_response }
    else
      render status: :unprocessable_entity, json: { status: :error, errors: resource.errors }
    end
  end

  protected
    def actions_for_insecure_sign_in
      return unless resource.class.allow_insecure_sign_in_after_accept

      resource.after_database_authentication
      set_token
      set_cookie
    end

    def set_token
      @token = resource.create_token
      resource.skip_confirmation!
      sign_in(:user, resource, store: false, bypass: false)
      resource.save!
    end

    def set_cookie
      return unless DeviseTokenAuth.cookie_enabled

      auth_header = resource.build_auth_headers(@token.token, @token.client)
      cookies[DeviseTokenAuth.cookie_name] = DeviseTokenAuth.cookie_attributes.merge(value: auth_header.to_json)
    end

    def accept_resource
      resource_class.accept_invitation!(@update_resource_params)
    end

    def configure_permitted_parameters
      @update_resource_params = params.permit(%i[invitation_token password password_confirmation])
    end
end
