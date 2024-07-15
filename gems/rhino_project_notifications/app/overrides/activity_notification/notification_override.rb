# frozen_string_literal: true

module ActivityNotification
  module ORM
    module ActiveRecord
      class Notification
        serialize :parameters, coder: Hash
      end
    end
  end
end
