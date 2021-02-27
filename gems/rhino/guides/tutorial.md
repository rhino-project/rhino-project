# Demo Tutorial

This guide is a step-by-step tutorial to launch and customize the application

## Prerequisites

Make sure you have below installed:

    - Ruby version: 2.6.6
    - Bundler 2.1.4
    - Rails: 6.0.3.4
    - PostgreSQL: 9.4 or newer
    - node 12.16.1

## Launch the application

### Client side

1. Clone the repo
   `git clone git@github.com:nubinary/boilerplate_client.git`

2. `cd boilerplate_client`

3. Install dependencies: `npm install`

4. Copy `env.sample` to `.env` and modify env vars

   API_ROOT_PATH: url of the api to which this client will send requests.

   By default with the boilerplate_server this would be `API_ROOT_PATH=http://localhost:3000`

5. Run the application client: `npm run dev`

### Server side

1. Clone the repo
   `git clone git@github.com:nubinary/boilerplate_server.git`

2. `cd boilerplate_server`

3. Copy `env.sample` to `.env` and modify env vars. Pay attention to `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`. They should be good defaults for MacOS with postgress installed via homebrew, but may need altering for other platforms

4. Install gem dependencies `bundle install`

5. Create and load the database `rails db:setup`

6. Run the server to check the results `rails s`

## Add blogs and blog posts

1. Create blogs and blog posts migrations

   `rails g model blog user:references title:string published_at:datetime`

   `rails g model blog_post blog:references title:string body:text published:boolean`

2. Add created models to db `rails db:migrate`

3. Add rails associations, rails validations and rhino configurations to related model file `app/models/blog.rb`

```Ruby
  has_many :blog_posts, dependent: :destroy

  has_one_attached :banner

  rhino_owner_base
  rhino_references [:user, :banner_attachment]
  rhino_search [:title]

  validates :title, presence: true
```

4. Add rails associations, rails validations and rhino configurations to related model file `app/models/blog_post.rb`

```Ruby
  rhino_owner :blog
  rhino_references %i[blog]

  validates :title, presence: true
  validates :body, presence: true

```

5. Update rhino config `config/initializers/rhino.rb` adding Blog and BlogPost as resources

```Ruby
config.resources += ['User', 'Blog', 'BlogPost']
```

6. Run the server to check the results `rails s`

## Add categories:

1. Create categories migration and add them to blogs

   `rails g model category name:string`

   `rails g migration add_category_to_blogs category:references`

2. Update migration file `add_category_to_blogs` set `null: true`

3. Add created models to db `rails db:migrate`

4. Add rails associations, rails validations and rhino configurations to model file `app/models/category.rb`

```Ruby
  has_many :blogs, dependent: :nullify

  rhino_owner_global
  rhino_sieves.swap Rhino::Sieve::Limit, Rhino::Sieve::Limit, default_limit: nil

  rhino_search [:name]
```

5. Update category owner model blog `app/models/blog.rb`. Add/edit these lines:

```Ruby
belongs_to :category, optional: true


rhino_references [:user, :category, :banner_attachment]
```

6. Update rhino config `config/initializers/rhino.rb` adding Category as resource

```Ruby
config.resources += ['User', 'Blog', 'BlogPost', 'Category']
```

7. Use seed data to add categories
   Add below to `db/seeds.rb`

```Ruby
3.times do
  Category.create!(name: FFaker::Book.unique.genre)
end
```

Then `rails db:seed`

8. Run the server to check the results `rails s`

## Add tags

1. add acts-as-taggable-on to Gemfile

- Add dependency to gemfile `gem 'acts-as-taggable-on', '~> 7.0'`

- Install the dependency `bundle`

- Install migrations

  `rails acts_as_taggable_on_engine:install:migrations`

- Review the generated migrations then migrate :

  `rails db:migrate`

2. Add `acts_as_taggable_on :tags` to related model `blog_post.rb`

3. Run the server to check the results `rails s`

## Add OG meta tags

1. Create OG meta tags migration and add them to blogs

   `rails g model og_meta_tag blog_post:references tag_name:string value:string`

2. Add created models to db `rails db:migrate`

3. Add rails associations, rails validations and rhino configurations to model file `app/models/og_meta_tag.rb`

```Ruby
  rhino_owner :blog_post
  rhino_references [{ blog_post: [:blog] }]

  validates :tag_name, presence: true
  validates :value, presence: true

  def display_name
    "#{tag_name}: #{value}"
  end
```

5. Update ogMetaTag owner model blog `app/models/blog_post.rb`. Add/edit these lines:

```Ruby
has_many :og_meta_tags, dependent: :destroy

accepts_nested_attributes_for :og_meta_tags, allow_destroy: true

rhino_references %i[blog og_meta_tags]
```

6. Update rhino config `config/initializers/rhino.rb` adding OgMetaTag as resource

```Ruby
config.resources += ['User', 'Blog', 'BlogPost', 'Category', 'OgMetaTag']
```

7. Run the server to check the results `rails s`

## Convert to organization

1. Creating roles and organizations and update user `rails rhino_organizations:install`

2. `rails g migration add_organization_to_blog organization:references`

3. Add created models to db `rails db:migrate`

4. Add `belongs_to :organization` to `app/models/blog.rb`

5. Update rhino config `config/initializers/rhino.rb` add Organization as resource and set it as the base owner

```Ruby
config.base_owner = 'Organization'

config.resources += ['User', 'Blog', 'BlogPost', 'Category', 'OgMetaTag' , 'Organization']
```

6.  Use seed data to add organizations
    Add below to `db/seeds.rb`

```Ruby
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

Then `rails db:drop` and `rails db:setup`

7. Run the server to check the results `rails s`
