# frozen_string_literal: true

RSpec.describe RuboCop::Cop::Rails::Blank, :config do
  shared_examples 'offense' do |source, correction, message|
    it 'registers an offense and corrects' do
      expect_offense(<<~RUBY, source: source, message: message)
        #{source}
        ^{source} #{message}
      RUBY

      expect_correction(<<~RUBY)
        #{correction}
      RUBY
    end
  end

  context 'NilOrEmpty set to true' do
    let(:cop_config) do
      { 'NilOrEmpty' => true }
    end

    it 'accepts checking nil?' do
      expect_no_offenses('foo.nil?')
    end

    it 'accepts checking empty?' do
      expect_no_offenses('foo.empty?')
    end

    it 'accepts checking nil? || empty? on different objects' do
      expect_no_offenses('foo.nil? || bar.empty?')
    end

    # Bug: https://github.com/rubocop/rubocop/issues/4171
    it 'does not break when RHS of `or` is a naked falsiness check' do
      expect_no_offenses('foo.empty? || bar')
    end

    it 'does not break when LHS of `or` is a naked falsiness check' do
      expect_no_offenses('bar || foo.empty?')
    end

    # Bug: https://github.com/rubocop/rubocop/issues/4814
    it 'does not break when LHS of `or` is a send node with an argument' do
      expect_no_offenses('x(1) || something')
    end

    context 'nil or empty' do
      it_behaves_like 'offense', 'foo.nil? || foo.empty?',
                      'foo.blank?',
                      'Use `foo.blank?` instead of `foo.nil? || foo.empty?`.'
      it_behaves_like 'offense', 'nil? || empty?', 'blank?', 'Use `blank?` instead of `nil? || empty?`.'
      it_behaves_like 'offense', 'foo == nil || foo.empty?',
                      'foo.blank?',
                      'Use `foo.blank?` instead of `foo == nil || foo.empty?`.'
      it_behaves_like 'offense', 'nil == foo || foo.empty?',
                      'foo.blank?',
                      'Use `foo.blank?` instead of `nil == foo || foo.empty?`.'
      it_behaves_like 'offense', '!foo || foo.empty?', 'foo.blank?', 'Use `foo.blank?` instead of `!foo || foo.empty?`.'

      it_behaves_like 'offense', 'foo.nil? || !!foo.empty?',
                      'foo.blank?',
                      'Use `foo.blank?` instead of `foo.nil? || !!foo.empty?`.'
      it_behaves_like 'offense', 'foo == nil || !!foo.empty?',
                      'foo.blank?',
                      'Use `foo.blank?` instead of ' \
                      '`foo == nil || !!foo.empty?`.'
      it_behaves_like 'offense', 'nil == foo || !!foo.empty?',
                      'foo.blank?',
                      'Use `foo.blank?` instead of ' \
                      '`nil == foo || !!foo.empty?`.'
    end

    context 'checking all variable types' do
      it_behaves_like 'offense', 'foo.bar.nil? || foo.bar.empty?',
                      'foo.bar.blank?',
                      'Use `foo.bar.blank?` instead of ' \
                      '`foo.bar.nil? || foo.bar.empty?`.'
      it_behaves_like 'offense', 'FOO.nil? || FOO.empty?',
                      'FOO.blank?',
                      'Use `FOO.blank?` instead of `FOO.nil? || FOO.empty?`.'
      it_behaves_like 'offense', 'Foo.nil? || Foo.empty?',
                      'Foo.blank?',
                      'Use `Foo.blank?` instead of `Foo.nil? || Foo.empty?`.'
      it_behaves_like 'offense', 'Foo::Bar.nil? || Foo::Bar.empty?',
                      'Foo::Bar.blank?',
                      'Use `Foo::Bar.blank?` instead of ' \
                      '`Foo::Bar.nil? || Foo::Bar.empty?`.'
      it_behaves_like 'offense', '@foo.nil? || @foo.empty?',
                      '@foo.blank?',
                      'Use `@foo.blank?` instead of `@foo.nil? || @foo.empty?`.'
      it_behaves_like 'offense', '$foo.nil? || $foo.empty?',
                      '$foo.blank?',
                      'Use `$foo.blank?` instead of `$foo.nil? || $foo.empty?`.'
      it_behaves_like 'offense', '@@foo.nil? || @@foo.empty?',
                      '@@foo.blank?',
                      'Use `@@foo.blank?` instead of ' \
                      '`@@foo.nil? || @@foo.empty?`.'
      it_behaves_like 'offense', 'foo[bar].nil? || foo[bar].empty?',
                      'foo[bar].blank?',
                      'Use `foo[bar].blank?` instead of ' \
                      '`foo[bar].nil? || foo[bar].empty?`.'
      it_behaves_like 'offense', 'foo(bar).nil? || foo(bar).empty?',
                      'foo(bar).blank?',
                      'Use `foo(bar).blank?` instead of ' \
                      '`foo(bar).nil? || foo(bar).empty?`.'
    end
  end

  context 'NotPresent set to true' do
    let(:cop_config) do
      { 'NotPresent' => true }
    end

    it_behaves_like 'offense', '!foo.present?', 'foo.blank?', 'Use `foo.blank?` instead of `!foo.present?`.'
    it_behaves_like 'offense', 'not foo.present?', 'foo.blank?', 'Use `foo.blank?` instead of `not foo.present?`.'
    it_behaves_like 'offense', '!present?', 'blank?', 'Use `blank?` instead of `!present?`.'

    it 'accepts !present? if its in the body of a `blank?` method' do
      expect_no_offenses('def blank?; !present? end')
    end
  end

  context 'UnlessPresent set to true' do
    let(:cop_config) do
      { 'UnlessPresent' => true }
    end

    it 'accepts modifier if present?' do
      expect_no_offenses('something if foo.present?')
    end

    it 'accepts modifier unless blank?' do
      expect_no_offenses('something unless foo.blank?')
    end

    it 'accepts normal if present?' do
      expect_no_offenses(<<~RUBY)
        if foo.present?
          something
        end
      RUBY
    end

    it 'accepts normal unless blank?' do
      expect_no_offenses(<<~RUBY)
        unless foo.blank?
          something
        end
      RUBY
    end

    it 'accepts elsif present?' do
      expect_no_offenses(<<~RUBY)
        if bar.present?
          something
        elsif bar.present?
          something_else
        end
      RUBY
    end

    context 'modifier unless' do
      context 'with a receiver' do
        it 'registers an offense and corrects' do
          expect_offense(<<~RUBY)
            something unless foo.present?
                      ^^^^^^^^^^^^^^^^^^^ Use `if foo.blank?` instead of `unless foo.present?`.
          RUBY

          expect_correction(<<~RUBY)
            something if foo.blank?
          RUBY
        end
      end

      context 'without a receiver' do
        it 'registers an offense and corrects' do
          expect_offense(<<~RUBY)
            something unless present?
                      ^^^^^^^^^^^^^^^ Use `if blank?` instead of `unless present?`.
          RUBY

          expect_correction(<<~RUBY)
            something if blank?
          RUBY
        end
      end
    end

    context 'normal unless present?' do
      it 'registers an offense and corrects' do
        expect_offense(<<~RUBY)
          unless foo.present?
          ^^^^^^^^^^^^^^^^^^^ Use `if foo.blank?` instead of `unless foo.present?`.
            something
          end
        RUBY

        expect_correction(<<~RUBY)
          if foo.blank?
            something
          end
        RUBY
      end
    end

    context 'unless present? with an else' do
      context 'Style/UnlessElse disabled' do
        let(:config) do
          RuboCop::Config.new(
            'Rails/Blank' => {
              'UnlessPresent' => true
            },
            'Style/UnlessElse' => {
              'Enabled' => false
            }
          )
        end

        it 'registers an offense and corrects' do
          expect_offense(<<~RUBY)
            unless foo.present?
            ^^^^^^^^^^^^^^^^^^^ Use `if foo.blank?` instead of `unless foo.present?`.
              something
            else
              something_else
            end
          RUBY

          expect_correction(<<~RUBY)
            if foo.blank?
              something
            else
              something_else
            end
          RUBY
        end
      end

      context 'Style/UnlessElse enabled' do
        let(:config) do
          RuboCop::Config.new(
            'Rails/Blank' => {
              'UnlessPresent' => true
            },
            'Style/UnlessElse' => {
              'Enabled' => true
            }
          )
        end

        it 'does not register an offense' do
          expect_no_offenses(<<~RUBY)
            unless foo.present?
              something
            else
              something_else
            end
          RUBY
        end
      end
    end
  end

  context 'NilOrEmpty set to false' do
    let(:cop_config) do
      { 'NilOrEmpty' => false,
        'NotPresent' => true,
        'UnlessPresent' => true }
    end

    it 'accepts checking nil? || empty?' do
      expect_no_offenses('foo.nil? || foo.empty?')
    end
  end

  context 'NotPresent set to false' do
    let(:cop_config) do
      { 'NilOrEmpty' => true,
        'NotPresent' => false,
        'UnlessPresent' => true }
    end

    it 'accepts !present?' do
      expect_no_offenses('!foo.present?')
    end
  end

  context 'UnlessPresent set to false' do
    let(:cop_config) do
      { 'NilOrEmpty' => true,
        'NotPresent' => true,
        'UnlessPresent' => false }
    end

    it 'accepts unless present?' do
      expect_no_offenses('something unless foo.present?')
    end
  end
end
