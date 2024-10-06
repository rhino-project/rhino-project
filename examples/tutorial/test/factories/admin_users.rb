# frozen_string_literal: true

require "ffaker"

FactoryBot.define do
  factory :admin_user do
    email { FFaker::Internet.safe_email }
    password { "password" }
  end
end
