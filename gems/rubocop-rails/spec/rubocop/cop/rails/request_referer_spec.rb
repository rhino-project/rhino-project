# frozen_string_literal: true

RSpec.describe RuboCop::Cop::Rails::RequestReferer, :config do
  context 'when EnforcedStyle is referer' do
    let(:cop_config) { { 'EnforcedStyle' => 'referer' } }

    it 'registers an offense and corrects request.referrer' do
      expect_offense(<<~RUBY)
        puts request.referrer
             ^^^^^^^^^^^^^^^^ Use `request.referer` instead of `request.referrer`.
      RUBY

      expect_correction(<<~RUBY)
        puts request.referer
      RUBY
    end
  end

  context 'when EnforcedStyle is referrer' do
    let(:cop_config) { { 'EnforcedStyle' => 'referrer' } }

    it 'registers an offense and corrects request.referer' do
      expect_offense(<<~RUBY)
        puts request.referer
             ^^^^^^^^^^^^^^^ Use `request.referrer` instead of `request.referer`.
      RUBY

      expect_correction(<<~RUBY)
        puts request.referrer
      RUBY
    end
  end
end
