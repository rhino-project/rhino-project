# frozen_string_literal: true

require_relative "users"

Organization.find_or_create_by(name: "Rhino")
Role.find_or_create_by(name: "admin")
UsersRole.find_or_create_by(user: User.first, role: Role.find_by(name: "admin"), organization: Organization.first)
