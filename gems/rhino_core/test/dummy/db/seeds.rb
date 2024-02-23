# frozen_string_literal: true

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

if Rails.env.development?
  user = User.create!(email: 'test@example.com', password: 'password', password_confirmation: 'password', confirmed_at: Time.current)

  5.times do
    Category.create!(name: FFaker::Book.unique.genre)
  end
  5.times  do
    blog = Blog.create!(user_id: user.id, title: FFaker::Book.unique.author)
    Category.all.sample(rand(1..3)).each do |category|
      BlogsCategory.create!(blog: blog, category: category)
    end
    20.times do
      BlogPost.create!(blog_id: blog.id, title: FFaker::Book.unique.title, body: FFaker::Book.unique.description, published: [true, false].sample)
    end
  end
end
