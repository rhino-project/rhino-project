# Generate sample categories
3.times do
  Category.create!(name: FFaker::Book.unique.genre)
end
