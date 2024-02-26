# frozen_string_literal: true

module Rhino
  module SetCurrentUser
    extend ActiveSupport::Concern

    included do
      before_action do
        Current.user = current_user
      end
    end
  end
end
