# frozen_string_literal: true

# Order dependent. E.g. rhino_notifications depends on rhino_jobs.
FRAMEWORKS = %w(
rhino_project_core
rhino_project_organizations
rhino_project_jobs
rhino_project_notifications
rhino_project_subscriptions
)

root    = File.expand_path("..", __dir__)
version = File.read("#{root}/RHINO_PROJECT_VERSION").strip
tag     = "v#{version}"

directory "pkg"

(FRAMEWORKS + ["rhino_project"]).each do |framework|
  namespace framework do
    gem     = "pkg/#{framework}-#{version}.gem"
    gemspec = "#{framework}.gemspec"

    task :clean do
      rm_f gem
    end

    task :update_versions do
      glob = root.dup
      if framework == "rhino_project"
        glob << "/version.rb"
      else
        glob << "/#{framework}/lib/*"
        glob << "/version.rb"
      end

      puts glob
      file = Dir[glob].first
      ruby = File.read(file)

      major, minor, tiny, pre = version.split(".", 4)
      pre = pre ? pre.inspect : "nil"

      ruby.gsub!(/^(\s*)MAJOR(\s*)= .*?$/, "\\1MAJOR = #{major}")
      raise "Could not insert MAJOR in #{file}" unless $1

      ruby.gsub!(/^(\s*)MINOR(\s*)= .*?$/, "\\1MINOR = #{minor}")
      raise "Could not insert MINOR in #{file}" unless $1

      ruby.gsub!(/^(\s*)TINY(\s*)= .*?$/, "\\1TINY  = #{tiny}")
      raise "Could not insert TINY in #{file}" unless $1

      ruby.gsub!(/^(\s*)PRE(\s*)= .*?$/, "\\1PRE   = #{pre}")
      raise "Could not insert PRE in #{file}" unless $1

      File.open(file, "w") { |f| f.write ruby }
    end

    task gem => %w(update_versions pkg) do
      cmd = ""
      cmd += "cd #{framework} && " unless framework == "rhino_project"
      cmd += "bundle exec rake package && " unless framework == "rhino_project"
      cmd += "gem build #{gemspec} && mv #{framework}-#{version}.gem #{root}/pkg/"
      sh cmd
    end

    task build: [:clean, gem]
    task install: :build do
      sh "gem install --pre #{gem}"
    end

    task push: :build do
      otp = ""
      begin
        otp = " --otp " + `ykman oath accounts code -s rubygems.org`.chomp
      rescue
        # User doesn't have ykman
      end

      sh "gem push #{gem}#{otp}"
    end
  end
end

namespace :all do
  task build: FRAMEWORKS.map { |f| "#{f}:build"           } + ["rhino_project:build"]
  task update_versions: FRAMEWORKS.map { |f| "#{f}:update_versions" } + ["hino_project:update_versions"]
  task install: FRAMEWORKS.map { |f| "#{f}:install"         } + ["hino_project:install"]
  task push: FRAMEWORKS.map { |f| "#{f}:push"            } + ["rhino_project:push"]

  task :ensure_clean_state do
    files = `git status -s | grep -v 'RHINO_PROJECT_VERSION\\|CHANGELOG\\|Gemfile.lock\\|package.json\\|version.rb\\|tasks/release.rb'`
    unless files.strip.empty?
      abort "[ABORTING] `git status` reports a dirty tree. Make sure all changes are committed #{files}"
    end

    unless ENV["SKIP_TAG"] || `git tag | grep '^#{tag}$'`.strip.empty?
      puts tag
      abort "[ABORTING] `git tag` shows that #{tag} already exists. Has this version already\n"\
            "           been released? Git tagging can be skipped by setting SKIP_TAG=1"
    end
  end

  task verify: :install do
    require "tmpdir"

    cd Dir.tmpdir
    app_name = "verify-#{version}-#{Time.now.to_i}"
    sh "rails _#{version}_ new #{app_name} --skip-bundle" # Generate with the right version.
    cd app_name

    substitute = -> (file_name, regex, replacement) do
      File.write(file_name, File.read(file_name).sub(regex, replacement))
    end

    # Replace the generated gemfile entry with the exact version.
    substitute.call("Gemfile", /^gem "rails.*/, %{gem "rails", "#{version}"})
    substitute.call("Gemfile", /^# gem "image_processing/, 'gem "image_processing')
    sh "bundle"
    sh "rails action_mailbox:install"
    sh "rails action_text:install"

    sh "rails generate scaffold user name description:text admin:boolean"
    sh "rails db:migrate"

    # Replace the generated gemfile entry with the exact version.
    substitute.call("app/models/user.rb", /end\n\z/, <<~CODE)
        has_one_attached :avatar
        has_rich_text :description
      end
    CODE

    substitute.call("app/views/users/_form.html.erb", /text_area :description %>\n  <\/div>/, <<~CODE)
      rich_text_area :description %>\n  </div>

      <div class="field">
        Avatar: <%= form.file_field :avatar %>
      </div>
    CODE

    substitute.call("app/views/users/show.html.erb", /description %>\n<\/p>/, <<~CODE)
      description %>\n</p>

      <p>
        <% if @user.avatar.attached? -%>
          <%= image_tag @user.avatar.representation(resize_to_limit: [500, 500]) %>
        <% end -%>
      </p>
    CODE

    # Permit the avatar param.
    substitute.call("app/controllers/users_controller.rb", /:admin/, ":admin, :avatar")

    editor = ENV["VISUAL"] || ENV["EDITOR"]
    if editor
      `#{editor} #{File.expand_path(app_name)}`
    end

    puts "Booting a Rails server. Verify the release by:"
    puts
    puts "- Seeing the correct release number on the root page"
    puts "- Viewing /users"
    puts "- Creating a user"
    puts "- Updating a user (e.g. disable the admin flag)"
    puts "- Deleting a user on /users"
    puts "- Whatever else you want."
    begin
      sh "rails server"
    rescue Interrupt
      # Server passes along interrupt. Prevent halting verify task.
    end
  end

  task :bundle do
    sh "bundle check"
  end

  task prep_release: %w(ensure_clean_state build bundle)

  task release: %w(prep_release push)
end
