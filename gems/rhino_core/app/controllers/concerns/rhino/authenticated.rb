# frozen_string_literal: true

module Rhino
  module Authenticated
    extend ActiveSupport::Concern

    included do
      before_action :authenticate_user!
    end

    # Overrides the default devise_token_auth handler
    def render_authenticate_error
      cookies.delete(DeviseTokenAuth.cookie_name, domain: DeviseTokenAuth.cookie_attributes[:domain])

      super
    end
  end
end
