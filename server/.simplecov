SimpleCov.start "rails" do
  enable_coverage :branch

  add_group "Admin", "app/admin"
  add_group "Policies", "app/policies"
end
