# frozen_string_literal: true

RSpec.describe "RuboCop Rails Project", type: :feature do # rubocop:todo Metrics/BlockLength
  describe "default configuration file" do # rubocop:todo Metrics/BlockLength
    subject(:config) { RuboCop::ConfigLoader.load_file("config/default.yml") }

    let(:registry) { RuboCop::Cop::Registry.global }
    let(:cop_names) do
      registry.with_department(:Rails).cops.map(&:cop_name)
    end

    let(:configuration_keys) do
      config.tap { |c| c.delete("inherit_mode") }.keys
    end

    let(:version_regexp) { /\A\d+\.\d+\z|\A<<next>>\z/ }

    it "has a nicely formatted description for all cops" do
      cop_names.each do |name|
        description = config[name]["Description"]
        expect(description.nil?).to be(false)
        expect(description.include?("\n")).to be(false)

        start_with_subject = description.match(/\AThis cop (?<verb>.+?) .*/)
        suggestion = start_with_subject[:verb]&.capitalize if start_with_subject
        suggestion ||= "a verb"
        expect(start_with_subject).to(
          be_nil, "`Description` for `#{name}` should be started with `#{suggestion}` instead of `This cop ...`."
        )
      end
    end

    it "requires a nicely formatted `VersionAdded` metadata for all cops" do
      cop_names.each do |name|
        version = config.dig(name, "VersionAdded")
        expect(version.nil?).to(be(false), "`VersionAdded` configuration is required for `#{name}`.")
        expect(version).to(match(version_regexp), "#{version} should be format ('X.Y' or '<<next>>') for #{name}.")
      end
    end

    %w[VersionChanged VersionRemoved].each do |version_type|
      it "requires a nicely formatted `#{version_type}` metadata for all cops" do
        cop_names.each do |name|
          version = config.dig(name, version_type)
          next unless version

          expect(version).to(match(version_regexp), "#{version} should be format ('X.Y' or '<<next>>') for #{name}.")
        end
      end
    end

    it "has a period at EOL of description" do
      cop_names.each do |name|
        description = config[name]["Description"]

        expect(description).to match(/\.\z/)
      end
    end

    it "sorts configuration keys alphabetically" do
      expected = configuration_keys.sort
      configuration_keys.each_with_index do |key, idx|
        expect(key).to eq expected[idx]
      end
    end

    it "has a SupportedStyles for all EnforcedStyle and EnforcedStyle is valid" do
      errors = []
      cop_names.each do |name|
        enforced_styles = config[name].select { |key, _| key.start_with?("Enforced") }
        enforced_styles.each do |style_name, style|
          supported_key = RuboCop::Cop::Util.to_supported_styles(style_name)
          valid = config[name][supported_key]
          unless valid
            errors.push("#{supported_key} is missing for #{name}")
            next
          end
          next if valid.include?(style)

          errors.push("invalid #{style_name} '#{style}' for #{name} found")
        end
      end

      raise errors.join("\n") unless errors.empty?
    end
    it "does not have any duplication" do
      fname = File.expand_path("../config/default.yml", __dir__)
      content = File.read(fname)
      RuboCop::YAMLDuplicationChecker.check(content, fname) do |key1, key2|
        raise "#{fname} has duplication of #{key1.value} on line #{key1.start_line} and line #{key2.start_line}"
      end
    end
    it "does not include `Safe: true`" do
      cop_names.each do |name|
        safe = config[name]["Safe"]
        expect(safe).not_to be(true), "`#{name}` has unnecessary `Safe: true` config."
      end
    end

    it "does not include unnecessary `SafeAutoCorrect: false`" do
      cop_names.each do |cop_name|
        next unless config.dig(cop_name, "Safe") == false

        safe_autocorrect = config.dig(cop_name, "SafeAutoCorrect")

        expect(safe_autocorrect).not_to(be(false), "`#{cop_name}` has unnecessary `SafeAutoCorrect: false` config.")
      end
    end

    it "is expected that all cops documented with `@safety` are `Safe: false` or `SafeAutoCorrect: false`" do
      require "yard"

      YARD::Registry.load!

      unsafe_cops = YARD::Registry.all(:class).select do |example|
        example.tags.any? { |tag| tag.tag_name == "safety" }
      end

      unsafe_cop_names = unsafe_cops.map do |cop|
        department_and_cop_names = cop.path.split("::")[2..] # Drop `RuboCop::Cop` from class name.

        department_and_cop_names.join("/")
      end

      unsafe_cop_names.each do |cop_name|
        cop_config = config[cop_name]
        unsafe = cop_config["Safe"] == false || cop_config["SafeAutoCorrect"] == false

        expect(unsafe).to(
          be(true),
          "`#{cop_name}` cop should be set `Safe: false` or `SafeAutoCorrect: false` " \
          "because `@safety` YARD tag exists."
        )
      end
    end

    it "sorts cop names alphabetically" do
      previous_key = ""
      config_default = YAML.load_file("config/default.yml")

      config_default.each_key do |key|
        next if %w[inherit_mode AllCops].include?(key)

        expect(previous_key <= key).to be(true), "Cops should be sorted alphabetically. Please sort #{key}."
        previous_key = key
      end
    end
  end
end
