# frozen_string_literal: true

require "ffaker"

FactoryBot.define do
  factory :blog do
    published_at { FFaker::Time.date }
    title { FFaker::Book.title }
    user

    after(:build) do |blog|
      blog.banner.attach(
        io: File.open(Rhino::Engine.root.join("test", "fixtures", "files", "banner.jpg")),
        filename: "banner.jpg",
        content_type: "image/jpeg"
      )
    end
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

  factory :blogs_categories do
    blog
    category
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

  factory :og_meta_tag do
    blog_post
    tag_name { FFaker::Lorem.word }
    value { FFaker::Lorem.paragraph }
  end

  factory :blog_dummy do
    name { FFaker::Name.name }
    blog
  end
end
# rubocop:enable Metrics/BlockLength
