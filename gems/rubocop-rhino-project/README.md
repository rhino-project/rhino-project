# RuboCop RhinoProject

## Installation

Just install the `rubocop-rhino-project` gem

```sh
$ gem install rubocop-rhino-project
```

or if you use bundler put this in your `Gemfile`

```ruby
gem 'rubocop-rhino-project', require: false
```

## Usage

You need to tell RuboCop to load the RhinoProject extension. There are three
ways to do this:

### RuboCop configuration file

Put this into your `.rubocop.yml`.

```yaml
require: rubocop-rhino-project
```

Alternatively, use the following array notation when specifying multiple extensions.

```yaml
require:
  - rubocop-other-extension
  - rubocop-rhino-project
```

Now you can run `rubocop` and it will automatically load the RuboCop RhinoProject
cops together with the standard cops.
