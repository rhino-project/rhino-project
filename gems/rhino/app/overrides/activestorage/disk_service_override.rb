# frozen_string_literal: true

require "active_storage/service/disk_service"

class ActiveStorage::Service::DiskService
  raise "No longer required in Rails 7 and above" if Rails::VERSION::MAJOR > 6

  attr_accessor :root
end
