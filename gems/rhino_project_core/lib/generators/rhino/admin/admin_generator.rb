# frozen_string_literal: true

require "rails/generators"

module Rhino
  class AdminGenerator < Rails::Generators::NamedBase
    source_root File.expand_path("templates", __dir__)

    def admin
      template "resource.rb", "app/admin/#{file_path.tr('/', '_').pluralize}.rb" unless options[:skip_admin]
    end
  end
end
