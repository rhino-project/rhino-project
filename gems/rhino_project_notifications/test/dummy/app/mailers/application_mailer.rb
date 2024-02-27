# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch("DEFAULT_EMAIL_SENDER", "from@example.com")
  layout "mailer"
end
