# frozen_string_literal: true

# Authentication based on
# https://stackoverflow.com/questions/39741120/how-to-use-devise-token-auth-with-actioncable-for-authenticating-user
# https://guides.rubyonrails.org/action_cable_overview.html#connections
module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
      logger.add_tags "ActionCable", current_user.email
    end

    def find_verified_user
      params = JSON.parse(cookies[DeviseTokenAuth.cookie_name])
      access_token_name, uid_name, client_name = headers_names
      token, uid, client_id = params&.values_at(access_token_name, uid_name, client_name)

      # https://github.com/lynndylanhurley/devise_token_auth/blob/master/app/controllers/devise_token_auth/concerns/set_user_by_token.rb#L78
      user = Rhino.auth_owner.dta_find_by(uid:)
      return user if user&.valid_token?(token, client_id)

      reject_unauthorized_connection
    rescue StandardError
      reject_unauthorized_connection
    end

    private
      def headers_names
        uid_name = DeviseTokenAuth.headers_names[:uid]
        access_token_name = DeviseTokenAuth.headers_names[:"access-token"]
        client_name = DeviseTokenAuth.headers_names[:client]
        [access_token_name, uid_name, client_name]
      end
  end

  def reject_unauthorized_connection
    cookies.delete(DeviseTokenAuth.cookie_name, domain: DeviseTokenAuth.cookie_attributes[:domain])
    super
  end
end
