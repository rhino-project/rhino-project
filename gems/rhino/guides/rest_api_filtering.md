# Rhino REST API - Filtering

This guide demonstrates use cases for the Filter Sieve. This sieve is used when a `filter` parameter is found in the query parameters, _e.g._ `?filter[name]=Rhino`.

## General usage

The canonical use case for the filter sieve is to query for results that have a certain field equal to a specific value. For example, if it is needed to fetch users that have the first name equal to `Mary`, the request and its query parameters could be:

```
/users?filter[first_name]=Mary
```

The general format is therefore using a `filter` parameter with the field name (`first_name`) between square brackets `[]`. The value should not have quotes.

## Comparison operators

The Filter sieve supports many comparison operators. They are all unary, meaning that they will always compare a column against the given value. The comparison method varies depending on the operator:

- `gt`: **greater than**
- `lt`: **less than**
- `gteq`: **greater than or equal to**
- `lteq`: **less than or equal to**
- `eq`: **equal to**
- `diff`: **different from**

In order to use them, one must chain them under the column name. For example, if it is needed to fetch blog posts created after June 30th 2002:

```
/blog_posts?filter[created_at][gt]=2002-06-30
```

### Null-aware operators

Using query params to compare fields to `null` is always tricky, because everything from query params is treated as text, so using:

```
/blog_posts?filter[title][eq]=null
```

would not compare the `title` to the `null` value, instead it would compare it to a string `"null"`.

The `is_null` operator can be used to achieve explicit `null` comparison. Using `true` as argument makes the database query look for records that have a field equal to `null`. Using `false`, on the other hand, make the database query look for records that **do not** have a field equal to `null`.

Therefore,

```
/blog_posts?filter[title][is_null]=true
```

translates to something like

```
... WHERE title IS NULL
```

whereas

```
/blog_posts?filter[title][is_null]=false
```

translates to something like

```
... WHERE title IS NOT NULL
```

### Combining operators

Using more than one operator for a single field is supported, so searching for objects with a certain column in a range of two values is simple. In order to fetch all blog posts created **between** June 30th 2002 and July 8th 2014:

```
/blog_posts?filter[created_at][gt]=2002-06-30&[created_at][lt]=2014-07-08
```

Naturally, the operators applied to the same field will be combined with an `AND` operation.

### Equality shorthand

If no operator is specified, the sieve will assume the equality operator `eq`. Therefore,

```
/users?filter[first_name]=Mary
```

is the same as

```
/users?filter[first_name][eq]=Mary
```

## Relationships

This sieve can also detect referecend joined tables and compose a join clause with all the tables needed in order to query for nested tables attributes.
For example, it is possible to fetch blog posts from a certain blog (using the blog's id) or to fetch all blog posts from any blog created before some specific date. Those queries could be, respectively:

```
/blog_posts?filter[blog]=1
```

and

```
/blog_posts?filter[blog][created_at][lteq]=1999-12-31
```

### Belongs to

It is possible to fetch resources that belong specifically to another resource. For the case of blog posts, that each belong to blog, if a certain blog has id `1` and it is needed to get all blog posts from this blog:

```
/blog_posts?filter[blog]=1
```

The sieve engine will identify the relationship and assemble the query using the `blog_id` column from the `blog_posts` table.
As `id` is an attribute just like any other else, one could use the more explicit forms:

```
/blog_posts?filter[blog_id]=1
```

or

```
/blog_posts?filter[blog][id]=1
```

or even

```
/blog_posts?filter[blog][id][eq]=1
```

### Has many

_Has many_ replationships works the same way as _belong to_. However, it is important to mind the correct name of the relationship, generally this kind of assocation uses the plural name of the related table. If blog posts had a 1:N relationship with, for example, a comments table, it would be possible to fetch posts that had at least one comment made by a user with id equal to 55:

```
/blog_posts?filter[comments][user]=55
```

or to fetch posts with at least one comment that doesn't have the content "Bad post.":

```
/blog_posts?filter[comments][content][diff]=Bad post.
```

### Polymorphic relationships

In the case of blog posts and tags, there is a polymorphic _many-to-many_ relationship.

```ruby
class BlogPost < ApplicationRecord
  acts_as_taggable_on :tags
end
```

This doesn't differ from a regular _has many_, so one could issue requests like:

```
/blog_posts?filter[tags]=1
```

or

```
/blog_posts?filter[tags][name]=Social
```

### Overriden relationship name

For the case of overriden names in relationships like:

```ruby
class Blog < ApplicationRecord
  belongs_to :author, default: -> { Rhino::Current.user }, class_name: 'User', foreign_key: :user_id
end
```

The the `user` field should be address by its alias `author`, as in:

```
/blogs?filter[author]=42
```

or

```
/blogs?filter[author][name]=Rhino
```
