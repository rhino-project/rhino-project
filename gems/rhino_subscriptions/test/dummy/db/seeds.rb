if Rails.env.development?
  user = User.create!(email: 'test@example.com', password: 'password', password_confirmation: 'password')
  user2 = User.create!(email: 'test2@example.com', password: 'password', password_confirmation: 'password')
end
