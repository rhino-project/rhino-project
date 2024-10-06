FactoryBot.define do
  factory :blog do
    user { nil }
    title { "MyString" }
    published_at { "2024-10-06 18:22:49" }
    category { nil }
  end
end
