# frozen_string_literal: true

say 'Copying Rhino models to app/models'
copy_file "#{__dir__}/templates/user.rb", 'app/models/user.rb'
