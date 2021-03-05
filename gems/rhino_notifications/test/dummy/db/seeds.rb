if Rails.env.development?
  user = User.create!(email: 'test@example.com', password: 'password', password_confirmation: 'password')
  user2 = User.create!(email: 'test2@example.com', password: 'password', password_confirmation: 'password')
  [user, user2].each do |u|
    10.times do
      Article.create!(user: u, title: FFaker::Book.unique.title, body: FFaker::Book.unique.description)
    end
  end
end
