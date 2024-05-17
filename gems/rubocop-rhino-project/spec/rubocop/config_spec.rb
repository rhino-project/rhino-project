# frozen_string_literal: true

RSpec.describe RuboCop::Config do
  include FileHelper

  subject(:configuration) { described_class.new(hash, loaded_path) }

  let(:loaded_path) { "example/.rubocop.yml" }
end
