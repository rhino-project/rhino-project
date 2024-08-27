# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_08_27_122714) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_record_tree_dummies", force: :cascade do |t|
    t.string "ancestry"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["ancestry"], name: "index_active_record_tree_dummies_on_ancestry"
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", precision: nil, null: false
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "blog_dummies", force: :cascade do |t|
    t.string "name"
    t.bigint "blog_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["blog_id"], name: "index_blog_dummies_on_blog_id"
  end

  create_table "blog_posts", force: :cascade do |t|
    t.bigint "blog_id", null: false
    t.string "title"
    t.text "body"
    t.boolean "published"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "status", default: 0
    t.index ["blog_id"], name: "index_blog_posts_on_blog_id"
  end

  create_table "blogs", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "title"
    t.datetime "published_at", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "country", limit: 2
    t.index ["user_id"], name: "index_blogs_on_user_id"
  end

  create_table "blogs_categories", force: :cascade do |t|
    t.bigint "blog_id"
    t.bigint "category_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["blog_id", "category_id"], name: "index_blogs_categories_on_blog_id_and_category_id", unique: true
    t.index ["blog_id"], name: "index_blogs_categories_on_blog_id"
    t.index ["category_id"], name: "index_blogs_categories_on_category_id"
  end

  create_table "categories", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "child_manies", force: :cascade do |t|
    t.bigint "parent_id", null: false
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["parent_id"], name: "index_child_manies_on_parent_id"
  end

  create_table "child_ones", force: :cascade do |t|
    t.bigint "parent_id", null: false
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["parent_id"], name: "index_child_ones_on_parent_id"
  end

  create_table "delegated_type_comments", force: :cascade do |t|
    t.string "subject"
    t.string "body"
    t.string "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "delegated_type_entries", force: :cascade do |t|
    t.string "entryable_type"
    t.integer "entryable_id"
    t.bigint "user_id", null: false
    t.string "string_field"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_delegated_type_entries_on_user_id"
  end

  create_table "delegated_type_messages", force: :cascade do |t|
    t.string "subject"
    t.string "body"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "dummies", force: :cascade do |t|
    t.string "field"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "every_field_dummies", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "string_overrideable"
    t.index ["user_id"], name: "index_every_field_dummies_on_user_id"
  end

  create_table "every_fields", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "string"
    t.string "string_length_min"
    t.string "string_length_max"
    t.string "string_length_range"
    t.string "string_length_exact"
    t.string "string_inclusion"
    t.string "string_pattern"
    t.float "float_gt"
    t.float "float_gte"
    t.float "float_lt"
    t.float "float_lte"
    t.float "float_in"
    t.float "float_no_nil"
    t.integer "integer_gt"
    t.integer "integer_gte"
    t.integer "integer_lt"
    t.integer "integer_lte"
    t.integer "integer_in"
    t.integer "integer_no_nil"
    t.date "date"
    t.date "date_required"
    t.datetime "date_time", precision: nil
    t.datetime "date_time_required", precision: nil
    t.time "time"
    t.time "time_required"
    t.integer "year"
    t.integer "year_required", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "currency", precision: 10, scale: 4
    t.decimal "currency_required", precision: 10, scale: 4, null: false
    t.integer "array_int", array: true
    t.integer "enum"
    t.integer "enum_required", null: false
    t.string "string_write_only"
    t.string "string_overrideable"
    t.string "phone"
    t.virtual "float_virtual", type: :float, as: "(float_no_nil / (2)::double precision)", stored: true
    t.string "string_readonly"
    t.index ["user_id"], name: "index_every_fields_on_user_id"
  end

  create_table "every_manies", force: :cascade do |t|
    t.bigint "every_field_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["every_field_id"], name: "index_every_manies_on_every_field_id"
  end

  create_table "geospatials", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.decimal "latitude"
    t.decimal "longitude"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_geospatials_on_user_id"
  end

  create_table "grand_child_manies", force: :cascade do |t|
    t.bigint "child_many_id", null: false
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["child_many_id"], name: "index_grand_child_manies_on_child_many_id"
  end

  create_table "grand_child_ones", force: :cascade do |t|
    t.bigint "child_one_id", null: false
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["child_one_id"], name: "index_grand_child_ones_on_child_one_id"
  end

  create_table "og_meta_tags", force: :cascade do |t|
    t.bigint "blog_post_id", null: false
    t.string "tag_name"
    t.string "value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["blog_post_id"], name: "index_og_meta_tags_on_blog_post_id"
  end

  create_table "parents", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_parents_on_user_id"
  end

  create_table "polymorphics", force: :cascade do |t|
    t.string "polyable_type", null: false
    t.bigint "polyable_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["polyable_type", "polyable_id"], name: "index_polymorphics_on_polyable"
  end

  create_table "property_lists", force: :cascade do |t|
    t.json "json_prop"
    t.jsonb "jsonb_prop"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "taggings", id: :serial, force: :cascade do |t|
    t.integer "tag_id"
    t.string "taggable_type"
    t.integer "taggable_id"
    t.string "tagger_type"
    t.integer "tagger_id"
    t.string "context", limit: 128
    t.datetime "created_at", precision: nil
    t.index ["context"], name: "index_taggings_on_context"
    t.index ["tag_id", "taggable_id", "taggable_type", "context", "tagger_id", "tagger_type"], name: "taggings_idx", unique: true
    t.index ["tag_id"], name: "index_taggings_on_tag_id"
    t.index ["taggable_id", "taggable_type", "context"], name: "taggings_taggable_context_idx"
    t.index ["taggable_id", "taggable_type", "tagger_id", "context"], name: "taggings_idy"
    t.index ["taggable_id"], name: "index_taggings_on_taggable_id"
    t.index ["taggable_type"], name: "index_taggings_on_taggable_type"
    t.index ["tagger_id", "tagger_type"], name: "index_taggings_on_tagger_id_and_tagger_type"
    t.index ["tagger_id"], name: "index_taggings_on_tagger_id"
  end

  create_table "tags", id: :serial, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.integer "taggings_count", default: 0
    t.index ["name"], name: "index_tags_on_name", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "provider", default: "email", null: false
    t.string "uid", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at", precision: nil
    t.datetime "remember_created_at", precision: nil
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at", precision: nil
    t.datetime "last_sign_in_at", precision: nil
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at", precision: nil
    t.datetime "confirmation_sent_at", precision: nil
    t.string "unconfirmed_email"
    t.string "name"
    t.string "nickname"
    t.string "image"
    t.string "email"
    t.jsonb "tokens"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.boolean "allow_password_change", default: false, null: false
    t.boolean "approved", default: false
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["uid", "provider"], name: "index_users_on_uid_and_provider", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "blog_dummies", "blogs"
  add_foreign_key "blog_posts", "blogs"
  add_foreign_key "blogs", "users"
  add_foreign_key "blogs_categories", "blogs"
  add_foreign_key "blogs_categories", "categories"
  add_foreign_key "child_manies", "parents"
  add_foreign_key "child_ones", "parents"
  add_foreign_key "delegated_type_entries", "users"
  add_foreign_key "every_field_dummies", "users"
  add_foreign_key "every_fields", "users"
  add_foreign_key "every_manies", "every_fields"
  add_foreign_key "geospatials", "users"
  add_foreign_key "grand_child_manies", "child_manies"
  add_foreign_key "grand_child_ones", "child_ones"
  add_foreign_key "og_meta_tags", "blog_posts"
  add_foreign_key "parents", "users"
  add_foreign_key "taggings", "tags"
end
