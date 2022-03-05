# Rhino Modules

This guide is an introduction to Rhino modules.

## Modules

Modules in Rhino extend functionality.

### Creating a module

A new module can be created with `rails rhino:module` or `rails rhino:module_full`. A full module should be use if you must provide models, controllers or other more complex functionality.

Module names should describe the functionality provided rather than the technology used, for instance 'rhino_subscriptions' instead of 'rhino_stripe'.

Each module provides an installation command for instance `rails rhino_jobs:install` that installs migrations (if any) and allows you to do any other setup work in `install_generator.rb`.

### Module registration

Modules should register themselves as appropriate in `engine.rb`, for instance if a model is present or an environment variable is set.

```
initializer 'rhino_organizations.register_module' do
  config.after_initialize do
    if Rhino.resources.include?('Organization')
      Rhino.registered_modules[:rhino_organizations] = {
        version: RhinoOrganizations::VERSION
      }
    end
  end
end
```

### Testing

After creating the module, add the tests to the CircleCI job
