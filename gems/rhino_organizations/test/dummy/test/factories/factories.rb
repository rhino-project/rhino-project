# frozen_string_literal: true

require "ffaker"

# rubocop:disable Metrics/BlockLength
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
    password { "password" }
    uid { FFaker::Guid.guid }
  end

  factory :organization do
    name { FFaker::Company.name }
  end

  factory :role do
    name { "admin" }
  end

  factory :users_role do
    user
    organization
    role
  end

  factory :og_meta_tag do
    blog_post
    tag_name { FFaker::Lorem.word }
    value { FFaker::Lorem.paragraph }
  end
end
# rubocop:enable Metrics/BlockLength
