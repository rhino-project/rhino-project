# frozen_string_literal: true

AdminUser.find_or_create_by(email: "admin@example.com") do |u|
  u.password = "password"
end

User.find_or_create_by(email: "test@example.com") do |u|
  u.password = "password"
  u.confirmed_at = DateTime.now
end
