# frozen_string_literal: true

RSpec.describe RuboCop::Cop::Rails::BelongsTo, :config do
  it 'registers an offense and corrects when specifying `required: false`' do
    expect_offense(<<~RUBY)
      belongs_to :foo, required: false
      ^^^^^^^^^^ You specified `required: false`, in Rails > 5.0 the required option is deprecated and you want to use `optional: true`.
    RUBY

    expect_correction(<<~RUBY)
      belongs_to :foo, optional: true
    RUBY
  end

  it 'registers an offense and corrects when specifying `required: true`' do
    expect_offense(<<~RUBY)
      belongs_to :foo, required: true
      ^^^^^^^^^^ You specified `required: true`, in Rails > 5.0 the required option is deprecated and you want to use `optional: false`. In most configurations, this is the default and you can omit this option altogether
    RUBY

    expect_correction(<<~RUBY)
      belongs_to :foo, optional: false
    RUBY
  end

  it 'registers an offense and corrects when using `belongs_to` lambda block with `required: false`' do
    expect_offense(<<~RUBY)
      belongs_to :foo, -> { bar }, required: false
      ^^^^^^^^^^ You specified `required: false`, in Rails > 5.0 the required option is deprecated and you want to use `optional: true`.
    RUBY

    expect_correction(<<~RUBY)
      belongs_to :foo, -> { bar }, optional: true
    RUBY
  end

  it 'registers no offense when setting `optional: true`' do
    expect_no_offenses('belongs_to :foo, optional: true')
  end

  it 'registers no offense when requires: false is not set' do
    expect_no_offenses('belongs_to :foo')
    expect_no_offenses('belongs_to :foo, polymorphic: true')
  end
end
