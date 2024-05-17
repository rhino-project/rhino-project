# frozen_string_literal: true

RSpec.describe "RuboCop::CLI --autocorrect", :isolated_environment do
  subject(:cli) { RuboCop::CLI.new }

  include_context "cli spec behavior"

  before do
    RuboCop::ConfigLoader.default_configuration.for_all_cops["SuggestExtensions"] = false
  end
end
