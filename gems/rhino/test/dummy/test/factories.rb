# frozen_string_literal: true

require 'ffaker'

FactoryBot.define do
  factory :blog do
    category
    published_at { FFaker::Time.date }
    title { FFaker::Book.title }
    user
  end

  factory :blog_post do
    blog
    body { FFaker::DizzleIpsum.paragraph }
    published { true }
    title { FFaker::Book.title }
  end

  factory :category do
    name { FFaker::Book.genre }
  end

  factory :user, aliases: [:author] do
    approved { true }
    confirmed_at { FFaker::Time.date }
    email { FFaker::Internet.safe_email }
    name { FFaker::Name.name }
    nickname { FFaker::Name.first_name }
    password { 'password' }
    uid { FFaker::Guid.guid }
  end
end
