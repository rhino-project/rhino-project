# frozen_string_literal: true

Rails.application.configure do
  Resque.redis = Redis.new(url: ENV['REDIS_URL'] || 'redis://localhost:6379', ssl_params: { verify_mode: OpenSSL::SSL::VERIFY_NONE } )
end
