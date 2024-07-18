# frozen_string_literal: true

# runs all files in db/seeds/*.rb
Dir[Rails.root.join("db/seeds/*.rb")].each do |seed|
  load seed
end

# runs all files in the specific envrironment folder db/seeds/development/*.rb, for example
Dir[Rails.root.join("db/seeds/#{Rails.env}/*.rb")].each do |seed|
  load seed
end
