# frozen_string_literal: true

module Rhino
  module Generators
    class UpdateGenerator < ::Rails::Generators::Base
      source_root File.expand_path("templates", __dir__)

      GIT_REPO = "https://github.com/rhino-project/rhino-project-template.git"

      class_option :git_ref, type: :string, default: "main", desc: "Git reference to use for the update"
      class_option :update_branch, type: :string, default: "chore/update-rhino", desc: "Branch to use for the update"


      def setup_remote_git
        say "Setting up git remote"
        system("git remote rm rhino-project-template") || raise("Failed to add remote")
        system("git remote add rhino-project-template git@github.com:rhino-project/rhino-project-template.git") || raise("Failed to add remote")
        system("git fetch rhino-project-template #{options[:git_ref]}:#{git_remote_branch}") || raise("Failed to fetch remote")
        system("git checkout #{git_remote_branch}") || raise("Failed to checkout remote branch")
      end

      def removing_node_modules
        say "Removing node_modules to avoid https://github.com/npm/cli/issues/4828"
        system("rm -rf node_modules") || raise("Failed to remove node_modules")
      end

      def branch_and_merge
        say "Branching and merging"
        system("git checkout -b #{options[:update_branch]}") || raise("Failed to checkout update branch")
        system("git merge #{git_remote_branch}")
      end

      def install_packages
        say "Installing packages"
        system("bundle install") || raise("Failed to install packages")
        system("npm install") || raise("Failed to install packages")
      end

      private
        def git_remote_branch
          "rhino-project-template-#{options[:git_ref]}"
        end
    end
  end
end
