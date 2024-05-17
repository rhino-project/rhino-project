# frozen_string_literal: true

RSpec.describe RuboCop::Cop::RhinoProject::DuplicateRhinoReferences, :config do
  describe "rhino_references" do
    it "registers an offense" do
      expect_offense(<<~RUBY)
        class Blog < ApplicationRecord
          belongs_to :user
          belongs_to :category

          rhino_references %i[user]
          ^^^^^^^^^^^^^^^^^^^^^^^^^ Avoid calling `rhino_references` method more than once in the same class.
          rhino_references %i[user category]
          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Avoid calling `rhino_references` method more than once in the same class.
        end
      RUBY
    end
  end
end
