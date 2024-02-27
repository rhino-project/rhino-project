# frozen_string_literal: true

if Rails.env.development?
  _user  = User.create!(email: 'test@example.com', password: 'password', password_confirmation: 'password', confirmed_at: Time.current)
  _user2 = User.create!(email: 'test2@example.com', password: 'password', password_confirmation: 'password', confirmed_at: Time.current)
end
