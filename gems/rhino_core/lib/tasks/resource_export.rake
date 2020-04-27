# frozen_string_literal: true

namespace :rhino do
  desc 'Export resource information for client'
  task resource_export: :environment do
    File.open('static.js', 'w') do |f|
      f.write "const api = #{Rhino::ResourceInfo.index};\n\n"
      f.write("export default api;\n")
    end
  end
end
