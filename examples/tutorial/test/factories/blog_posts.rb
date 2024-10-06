FactoryBot.define do
  factory :blog_post do
    blog { nil }
    title { "MyString" }
    body { "MyText" }
    published { false }
  end
end
