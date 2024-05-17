# frozen_string_literal: true

RSpec.describe RuboCop::Cop::Rails::ScopeArgs, :config do
  it 'registers and corrects an offense a scope with a method arg' do
    expect_offense(<<~RUBY)
      scope :active, where(active: true)
                     ^^^^^^^^^^^^^^^^^^^ Use `lambda`/`proc` instead of a plain method call.
    RUBY

    expect_correction(<<~RUBY)
      scope :active, -> { where(active: true) }
    RUBY
  end

  it 'accepts a non send argument' do
    expect_no_offenses('scope :active, "adsf"')
  end

  it 'accepts a stabby lambda' do
    expect_no_offenses('scope :active, -> { where(active: true) }')
  end

  it 'accepts a stabby lambda with arguments' do
    expect_no_offenses('scope :active, ->(active) { where(active: active) }')
  end

  it 'accepts a lambda' do
    expect_no_offenses('scope :active, lambda { where(active: true) }')
  end

  it 'accepts a lambda with a block argument' do
    expect_no_offenses('scope :active, lambda { |active| where(active: active) }')
  end

  it 'accepts a lambda with a multiline block' do
    expect_no_offenses(<<~RUBY)
      scope :active, (lambda do |active|
                       where(active: active)
                     end)
    RUBY
  end

  it 'accepts a proc' do
    expect_no_offenses('scope :active, proc { where(active: true) }')
  end
end
