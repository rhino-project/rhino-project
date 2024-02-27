# frozen_string_literal: true

# segment will be stubbed when testing
# when in development mode, segment will be stubbed if SEGMENT_WRITE_KEY is not set or is blank
# it won't be stubbed in production
Analytics = Segment::Analytics.new({
  stub:  Rails.env.test? || (Rails.env.development? && ENV["SEGMENT_WRITE_KEY"].blank?),
  write_key: ENV["SEGMENT_WRITE_KEY"] || "",
  on_error: Proc.new { |status, msg| print msg }
})
