# frozen_string_literal: true

class User < Rhino::User
  has_many :articles
  has_many :comments

  acts_as_target
end
