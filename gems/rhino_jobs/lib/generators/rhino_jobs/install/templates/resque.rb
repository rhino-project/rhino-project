# frozen_string_literal: true

Rails.application.configure do
  Resque.redis = ENV['REDIS_URL'] || 'localhost:6379'
end
