# frozen_string_literal: true

class EveryField < ApplicationRecord
  enum enum: { test: 0, example: 1 }

  belongs_to :user
  belongs_to :another_user, class_name: "User", foreign_key: :user_id
  has_many :every_manies, dependent: :destroy
  has_many :every_manies_not_nested, class_name: "EveryMany", inverse_of: :every_field_not_nested

  before_validation :normalize_phone

  acts_as_taggable_on :tags

  rhino_owner_base
  rhino_references %i[user another_user every_manies every_manies_not_nested]
  rhino_properties_read except: %i[string_write_only]
  rhino_properties_format year: :year, currency: :currency, phone: :phone
  rhino_properties_readable_name string_overrideable: "Overriden name"

  accepts_nested_attributes_for :every_manies, allow_destroy: true

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

  validates :phone, phone: { allow_nil: true, message: "not a valid phone number", possible: true }

  private
    def normalize_phone
      self.phone = Phonelib.parse(phone).full_e164.presence
    end
end
