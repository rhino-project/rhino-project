# frozen_string_literal: true

require "ffaker"

FactoryBot.define do
  factory :user do
    approved { true }
    confirmed_at { FFaker::Time.date }
    email { FFaker::Internet.safe_email }
    name { FFaker::Name.name }
    nickname { FFaker::Name.first_name }
    password { "password" }
    uid { FFaker::Guid.guid }
  end
end
