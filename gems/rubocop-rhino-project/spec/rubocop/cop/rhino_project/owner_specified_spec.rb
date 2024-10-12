# frozen_string_literal: true

RSpec.describe RuboCop::Cop::RhinoProject::OwnerSpecified, :config do
  describe "when the model is not listed in rhino.rb resources" do
    let(:source) { "class UnlistedModel < ApplicationRecord; end" }

    it "does not register an offense" do
      expect_no_offenses(source)
    end
  end

  describe "when the model is listed in rhino.rb resources" do
    before do
      allow(cop).to receive(:rhino_resources).and_return(["User", "Account"])
    end

    describe "and the model has no ownership method" do
      let(:source) { "class User < ApplicationRecord; end" }

      it "registers an offense" do
        expect_offense(<<~RUBY)
          class User < ApplicationRecord
          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ActiveRecord models listed in rhino.rb must specify exactly one ownership method (rhino_owner_global, rhino_owner_reference, or rhino_owner :symbol).
          end
        RUBY
      end
    end

    describe "and the model has more than one ownership method" do
      let(:source) do
        <<~RUBY
          require "json"

          class User < ApplicationRecord
            rhino_owner_global
            rhino_owner :organization
          end
        RUBY
      end

      it "registers an offense" do
        expect_offense(<<~RUBY)
          require "json"

          class User < ApplicationRecord
          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ActiveRecord models listed in rhino.rb must specify exactly one ownership method (rhino_owner_global, rhino_owner_reference, or rhino_owner :symbol).
            rhino_owner_global
            rhino_owner :organization
          end
        RUBY
      end
    end

    describe "and the model has exactly one ownership method" do
      let(:source) do
        <<~RUBY
          class User < ApplicationRecord
            rhino_owner_global
          end
        RUBY
      end

      it "does not register an offense" do
        expect_no_offenses(source)
      end
    end
  end

  describe "when the model inherits from Rhino::Account" do
    let(:source) { "class Account < Rhino::Account; end" }

    before do
      allow(cop).to receive(:rhino_resources).and_return(["Account"])
    end

    it "does not register an offense" do
      expect_no_offenses(source)
    end
  end
end
