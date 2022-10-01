# Demo Tutorial

This guide is a step-by-step tutorial to launch and customize the application

## Prerequisites

Make sure you have below installed:

    - Ruby version: 3.1.2
    - Bundler  2.3.11
    - Rails: 7.0.4
    - PostgreSQL: 12 or newer
    - node 14.16.1

## Launch the application

### Client side

- Clone the repo

```bash
$ git clone git@github.com:nubinary/boilerplate_client.git
$ cd boilerplate_client
```

- Install dependencies:

```bash
$ npm install
```

- Copy `env.sample` to `.env`

```bash
$ cp env.sample .env
```

and modify env vars:

API_ROOT_PATH: url of the api to which this client will send requests.

By default with the boilerplate_server this would be `API_ROOT_PATH=http://localhost:3000`

- Run the application client:

```bash
$ npm run dev
```

### Server side

- Clone the repo

```bash
$ git clone git@github.com:nubinary/boilerplate_server.git
$ cd boilerplate_server
```

- Copy `env.sample` to `.env` and modify env vars. Pay attention to `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`. They should be good defaults for MacOS with postgress installed via homebrew, but may need altering for other platforms

- Install gem dependencies

```bash
$ bundle install
```

- Create and load the database

```bash
$ rails db:setup
```

- Run the server to check the results

```bash
$ rails s
```

## Add blogs and blog posts

- Create blogs and blog posts migrations

```bash
$ rails g model blog user:references title:string published_at:datetime
$ rails g model blog_post blog:references title:string body:text published:boolean
```

- Add created models to db

```bash
$ rails db:migrate
```

- Add rails associations, rails validations and rhino configurations to related model file `app/models/blog.rb`

```ruby
  has_many :blog_posts, dependent: :destroy

  has_one_attached :banner

  rhino_owner_base
  rhino_references [:user, :banner_attachment]
  rhino_search [:title]

  validates :title, presence: true
```

- Add rails associations, rails validations and rhino configurations to related model file `app/models/blog_post.rb`

```ruby
  rhino_owner :blog
  rhino_references %i[blog]

  validates :title, presence: true
  validates :body, presence: true

```

- Update rhino config `config/initializers/rhino.rb` adding Blog and BlogPost as resources

```ruby
config.resources += ['User', 'Blog', 'BlogPost']
```

- Run the server to check the results `rails s`

## Add categories:

- Create categories migration and add them to blogs

```bash
$ rails g model category name:string
$ rails g migration add_category_to_blogs category:references
```

- Update migration file `add_category_to_blogs` set `null: true`

- Add created models to db

```bash
$ rails db:migrate
```

- Add rails associations, rails validations and rhino configurations to model file `app/models/category.rb`

```ruby
  has_many :blogs, dependent: :nullify

  rhino_owner_global
  rhino_sieves.swap Rhino::Sieve::Limit, Rhino::Sieve::Limit, default_limit: nil

  rhino_search [:name]
```

- Update category owner model blog `app/models/blog.rb`. Add/edit these lines:

```ruby
belongs_to :category, optional: true

rhino_references [:user, :category, :banner_attachment]
```

- Update rhino config `config/initializers/rhino.rb` adding Category as resource

```ruby
config.resources += ['User', 'Blog', 'BlogPost', 'Category']
```

- Use seed data to add categories
  Add below to `db/seeds.rb`

```ruby
3.times do
  Category.create!(name: FFaker::Book.unique.genre)
end
```

Then

```bash
$ rails db:seed
```

- Run the server to check the results

```bash
$ rails s
```

## Add tags

- add acts-as-taggable-on to Gemfile

- Add dependency to gemfile `gem 'acts-as-taggable-on', '~> 7.0'`

- Install the dependency `bundle`

- Install migrations

```bash
$ rails acts_as_taggable_on_engine:install:migrations`
```

- Review the generated migrations then migrate :

```bash
$ rails db:migrate
```

- Add `acts_as_taggable_on :tags` to related model `blog_post.rb`

- Run the server to check the results

```bash
$ rails s
```

## Add OG meta tags

- Create OG meta tags migration and add them to blogs

```bash
$ rails g model og_meta_tag blog_post:references tag_name:string value:string
```

- Add created models to db `rails db:migrate`

- Add rails associations, rails validations and rhino configurations to model file `app/models/og_meta_tag.rb`

```ruby
  rhino_owner :blog_post
  rhino_references [{ blog_post: [:blog] }]

  validates :tag_name, presence: true
  validates :value, presence: true

  def display_name
    "#{tag_name}: #{value}"
  end
```

- Update ogMetaTag owner model blog `app/models/blog_post.rb`. Add/edit these lines:

```ruby
has_many :og_meta_tags, dependent: :destroy

accepts_nested_attributes_for :og_meta_tags, allow_destroy: true

rhino_references %i[blog og_meta_tags]
```

- Update rhino config `config/initializers/rhino.rb` adding OgMetaTag as resource

```ruby
config.resources += ['User', 'Blog', 'BlogPost', 'Category', 'OgMetaTag']
```

- Run the server to check the results `rails s`

## Convert to organization

- Creating roles and organizations and update user `rails rhino_organizations:install`

- Update `app/models/blog.rb` as follows

```ruby

class Blog < ApplicationRecord
  belongs_to :organization
  belongs_to :author, default: -> { Rhino::Current.user }, class_name: 'User', foreign_key: :user_id

  belongs_to :category, optional: true
  has_many :blog_posts, dependent: :destroy

  has_one_attached :banner

  rhino_owner_base
  rhino_references %i[author organization category banner_attachment blog_posts]
  rhino_properties_write except: :author
  rhino_search [:title]

  validates :title, presence: true
end


```

- Have blogs owned by the organization

```bash
$ rails g migration add_organization_to_blog organization:references
```

- Use seed data to add organizations
  Add below to `db/seeds.rb`

```ruby
def generate_blogs(user, org)
  5.times do
    blog = Blog.create!(user_id: user.id, organization: org, title: FFaker::Book.unique.author, category_id: Category.ids.sample)
    20.times do
      BlogPost.create!(blog_id: blog.id, title: FFaker::Book.unique.title, body: FFaker::Book.unique.description, published: [true, false].sample)
    end
  end
end

if Rails.env.development?
  AdminUser.destroy_all
  Blog.destroy_all
  User.destroy_all
  Organization.destroy_all
  Role.destroy_all

  AdminUser.create!(email: 'admin@example.com', password: 'password', password_confirmation: 'password')

  user = User.create!(email: 'test@example.com', password: 'password', password_confirmation: 'password')
  user2 = User.create!(email: 'other@example.com', password: 'password', password_confirmation: 'password')

  org = []
  org << Organization.create!(name: "Single User Org")
  org << Organization.create!(name: "Multi User Owner Org")
  org << Organization.create!(name: "Viewer Org")
  org << Organization.create!(name: "Editor Org")
  org << Organization.create!(name: "Author Org")

  role = Role.find_or_create_by!(name: "admin")
  ur = UsersRole.create!(user: user, organization: org[0], role: role)

  role = Role.find_or_create_by!(name: "admin")
  ur = UsersRole.create!(user: user, organization: org[1], role: role)

  role = Role.find_or_create_by!(name: "viewer")
  ur = UsersRole.create!(user: user, organization: org[2], role: role)
  role = Role.find_or_create_by!(name: "admin")
  ur = UsersRole.create!(user: user2, organization: org[2], role: role)

  role = Role.find_or_create_by!(name: "editor")
  ur = UsersRole.create!(user: user, organization: org[3], role: role)
  role = Role.find_or_create_by!(name: "admin")
  ur = UsersRole.create!(user: user2, organization: org[3], role: role)

  role = Role.find_or_create_by!(name: "author")
  ur = UsersRole.create!(user: user, organization: org[4], role: role)
  role = Role.find_or_create_by!(name: "admin")
  ur = UsersRole.create!(user: user2, organization: org[4], role: role)

  3.times do
    Category.create!(name: FFaker::Book.unique.genre)
  end

  org.each do |o|
    generate_blogs(user, o)
  end

  org[2..].each do |o|
    generate_blogs(user2, o)
  end
end
```

- Then reset the database and seed data:

```bash
$ rails db:reset
```

- Add created models to db

```bash
$ rails db:migrate
```

- Run the server to check the results

```bash
$ rails s
```
