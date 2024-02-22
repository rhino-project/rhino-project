# frozen_string_literal: true

# Order dependent. E.g. Action Mailbox depends on Active Record so it should be after.
FRAMEWORKS = %w(
  rhino
)
FRAMEWORK_NAMES = Hash.new { |h, k| k.split(/(?<=active|action)/).map(&:capitalize).join(" ") }

root    = File.expand_path("..", __dir__)
version = File.read("#{root}/RHINO_PROJECT_VERSION").strip
tag     = "v#{version}"

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

    task gem => %w(update_versions) do
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

      if File.exist?("#{framework}/package.json")
        Dir.chdir("#{framework}") do
          npm_otp = ""
          begin
            npm_otp = " --otp " + `ykman oath accounts code -s npmjs.com`.chomp
          rescue
            # User doesn't have ykman
          end

          npm_tag = ""
          if /[a-z]/.match?(version)
            npm_tag = " --tag pre"
          else
            local_major_version = version.split(".", 4)[0]
            npm_tag = " --tag v#{local_major_version}"
          end

          sh "npm publish#{npm_tag}#{npm_otp}"
        end
      end
    end
  end
end

namespace :changelog do
  task :header do
    (FRAMEWORKS + ["guides"]).each do |fw|
      require "date"
      fname = File.join fw, "CHANGELOG.md"
      current_contents = File.read(fname)

      header = "## Rails #{version} (#{Date.today.strftime('%B %d, %Y')}) ##\n\n"
      header += "*   No changes.\n\n\n" if current_contents.start_with?("##")
      contents = header + current_contents
      File.write(fname, contents)
    end
  end

  task :release_date do
    (FRAMEWORKS + ["guides"]).each do |fw|
      require "date"
      replace = "## Rails #{version} (#{Date.today.strftime('%B %d, %Y')}) ##\n"
      fname = File.join fw, "CHANGELOG.md"

      contents = File.read(fname).sub(/^(## Rails .*)\n/, replace)
      File.write(fname, contents)
    end
  end

  task :release_summary, [:base_release, :release] do |_, args|
    release_regexp = args[:base_release] ? Regexp.escape(args[:base_release]) : /\d+\.\d+\.\d+/

    puts args[:release]

    FRAMEWORKS.each do |fw|
      puts "## #{FRAMEWORK_NAMES[fw]}"
      fname    = File.join fw, "CHANGELOG.md"
      contents = File.readlines fname
      contents.shift
      changes = []
      until contents.first =~ /^## Rails #{release_regexp}.*$/ ||
          contents.first =~ /^Please check.*for previous changes\.$/ ||
          contents.empty?
        changes << contents.shift
      end

      puts changes.join
      puts
    end
  end
end

namespace :all do
  task build: FRAMEWORKS.map { |f| "#{f}:build"           } + ["rhino:build"]
  task update_versions: FRAMEWORKS.map { |f| "#{f}:update_versions" } + ["rails:update_versions"]
  task install: FRAMEWORKS.map { |f| "#{f}:install"         } + ["rails:install"]
  task push: FRAMEWORKS.map { |f| "#{f}:push"            } + ["rails:push"]

  task :ensure_clean_state do
    unless `git status -s | grep -v 'RAILS_VERSION\\|CHANGELOG\\|Gemfile.lock\\|package.json\\|version.rb\\|tasks/release.rb'`.strip.empty?
      abort "[ABORTING] `git status` reports a dirty tree. Make sure all changes are committed"
    end

    unless ENV["SKIP_TAG"] || `git tag | grep '^#{tag}$'`.strip.empty?
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

  task :commit do
    unless `git status -s`.strip.empty?
      File.open("pkg/commit_message.txt", "w") do |f|
        f.puts "# Preparing for #{version} release\n"
        f.puts
        f.puts "# UNCOMMENT THE LINE ABOVE TO APPROVE THIS COMMIT"
      end

      sh "git add . && git commit --verbose --template=pkg/commit_message.txt"
      rm_f "pkg/commit_message.txt"
    end
  end

  task :tag do
    sh "git tag -s -m '#{tag} release' #{tag}"
    sh "git push --tags"
  end

  task prep_release: %w(ensure_clean_state build bundle commit)

  task release: %w(prep_release tag push)
end

module Announcement
  class Version
    def initialize(version)
      @version, @gem_version = version, Gem::Version.new(version)
    end

    def to_s
      @version
    end

    def previous
      @gem_version.segments[0, 3].tap { |v| v[2] -= 1 }.join(".")
    end

    def major_or_security?
      @gem_version.segments[2].zero? || @gem_version.segments[3].is_a?(Integer)
    end

    def rc?
      @version.include?("rc")
    end
  end
end

task :announce do
  Dir.chdir("pkg/") do
    versions = ENV["VERSIONS"] ? ENV["VERSIONS"].split(",") : [ version ]
    versions = versions.sort.map { |v| Announcement::Version.new(v) }

    raise "Only valid for patch releases" if versions.any?(&:major_or_security?)

    if versions.any?(&:rc?)
      require "date"
      future_date = Date.today + 5
      future_date += 1 while future_date.saturday? || future_date.sunday?

      github_user = `git config github.user`.chomp
    end

    require "erb"
    template = File.read("../tasks/release_announcement_draft.erb")

    puts ERB.new(template, trim_mode: "<>").result(binding)
  end
end
