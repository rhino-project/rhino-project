# frozen_string_literal: true

namespace :rhino do
  desc 'Export resource information for client'
  task resource_export: :environment do
    File.open('static.js', 'w') do |f|
      f.write "const models = #{JSON.pretty_generate(Rhino.resources.map(&:describe))};\n\n"
      f.write("export default models;\n")
    end
  end
end
