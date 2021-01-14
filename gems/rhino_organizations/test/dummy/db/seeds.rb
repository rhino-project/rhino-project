# frozen_string_literal: true

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

def generate_blogs(user, org)
  5.times do
    blog = Blog.create!(user_id: user.id, organization: org, title: FFaker::Book.unique.author, category_id: Category.ids.sample)
    20.times do
      BlogPost.create!(blog_id: blog.id, title: FFaker::Book.unique.title, body: FFaker::Book.unique.description, published: [true, false].sample)
    end
  end
end

if Rails.env.development?
  User.destroy_all
  Organization.destroy_all
  Role.destroy_all
  Blog.destroy_all

  user = User.create!(email: 'test@example.com', password: 'password', password_confirmation: 'password')
  user2 = User.create!(email: 'other@example.com', password: 'password', password_confirmation: 'password')

  org = []
  org << Organization.create!(name: "Single User Org")
  org << Organization.create!(name: "Multi User Owner Org")
  org << Organization.create!(name: "Viewer Org")
  org << Organization.create!(name: "Editor Org")
  org << Organization.create!(name: "Author Org")

  role = Role.find_or_create_by!(name: "admin")
  ur = UsersRole.create!(user: user, organization: org[0], role: role)

  role = Role.find_or_create_by!(name: "admin")
  ur = UsersRole.create!(user: user, organization: org[1], role: role)

  role = Role.find_or_create_by!(name: "viewer")
  ur = UsersRole.create!(user: user, organization: org[2], role: role)
  role = Role.find_or_create_by!(name: "admin")
  ur = UsersRole.create!(user: user2, organization: org[2], role: role)

  role = Role.find_or_create_by!(name: "editor")
  ur = UsersRole.create!(user: user, organization: org[3], role: role)
  role = Role.find_or_create_by!(name: "admin")
  ur = UsersRole.create!(user: user2, organization: org[3], role: role)

  role = Role.find_or_create_by!(name: "author")
  ur = UsersRole.create!(user: user, organization: org[4], role: role)
  role = Role.find_or_create_by!(name: "admin")
  ur = UsersRole.create!(user: user2, organization: org[4], role: role)

  3.times do
    Category.create!(name: FFaker::Book.unique.genre)
  end

  org.each do |o|
    generate_blogs(user, o)
  end

  org[2..].each do |o|
    generate_blogs(user2, o)
  end
end
