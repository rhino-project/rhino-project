# frozen_string_literal: true

namespace :rhino do
  namespace :dev do
    task setup: :environment do
      Rails::Command.invoke :generate, ["rhino:dev:setup"]
    end
  end
end
