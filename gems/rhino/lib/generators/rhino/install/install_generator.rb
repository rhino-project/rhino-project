# frozen_string_literal: true

module Rhino
  module Generators
    class InstallGenerator < ::Rails::Generators::Base
      source_root File.expand_path('templates', __dir__)

      def install_user
        say 'Installing user to app/models'
        template 'user.rb', 'app/models/user.rb'
      end

      def install_account
        say 'Installing account to app/models'
        template 'account.rb', 'app/models/account.rb'
      end

      def install_initializer
        say 'Installing initializer'
        template 'rhino.rb', 'config/initializers/rhino.rb'
      end
    end
  end
end
