# frozen_string_literal: true

class EveryField < ApplicationRecord
  belongs_to :user

  rhino_owner_base
  rhino_references [:user]
  rhino_properties_format year: :year, currency: :currency

  with_options allow_blank: true do
    validates :string_inclusion, inclusion: { in: %w[test example] }
    validates :string_length_min, length: { minimum: 2 }
    validates :string_length_max, length: { maximum: 5 }
    validates :string_length_range, length: { in: 2..5 }
    validates :string_length_exact, length: { is: 2 }
    validates :string_pattern, format: { with: /\A[Tt][a-zA-Z]+\z/ }
  end

  with_options allow_nil: true do
    validates :float_gt, numericality: { greater_than: 2 }
    validates :float_gte, numericality: { greater_than_or_equal_to: 2 }
    validates :float_lt, numericality: { less_than: 2 }
    validates :float_lte, numericality: { less_than_or_equal_to: 2 }
    validates :float_in, numericality: { in: 2..5 }

    validates :integer_gt, numericality: { only_integer: true, greater_than: 2 }
    validates :integer_gte, numericality: { only_integer: true, greater_than_or_equal_to: 2 }
    validates :integer_lt, numericality: { only_integer: true, less_than: 2 }
    validates :integer_lte, numericality: { only_integer: true, less_than_or_equal_to: 2 }
    validates :integer_in, numericality: { in: 2..5 }
  end

  validates :float_no_nil, numericality: true
  validates :integer_no_nil, numericality: { only_integer: true }

  validates :date_required, presence: true

  validates :date_time_required, presence: true

  validates :time_required, presence: true

  validates :currency, presence: true

  validates :year, numericality: { only_integer: true, allow_nil: true, greater_than: 5.years.ago.year, less_than: 0.years.ago.year }
end
