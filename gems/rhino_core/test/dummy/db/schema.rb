# frozen_string_literal: true

# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20_200_508_001_728) do
  create_table 'categories', force: :cascade do |t|
    t.string 'name'
    t.datetime 'created_at', precision: 6, null: false
    t.datetime 'updated_at', precision: 6, null: false
  end

  create_table 'resource_children', force: :cascade do |t|
    t.string 'string_prop'
    t.integer 'resource_id', null: false
    t.datetime 'created_at', precision: 6, null: false
    t.datetime 'updated_at', precision: 6, null: false
    t.index ['resource_id'], name: 'index_resource_children_on_resource_id'
  end

  create_table 'resource_parents', force: :cascade do |t|
    t.string 'string_prop'
    t.integer 'integer_prop'
    t.datetime 'created_at', precision: 6, null: false
    t.datetime 'updated_at', precision: 6, null: false
  end

  create_table 'resources', force: :cascade do |t|
    t.string 'string_prop'
    t.integer 'integer_prop'
    t.integer 'resource_parent_id', null: false
    t.datetime 'created_at', precision: 6, null: false
    t.datetime 'updated_at', precision: 6, null: false
    t.index ['resource_parent_id'], name: 'index_resources_on_resource_parent_id'
  end

  add_foreign_key 'resource_children', 'resources'
  add_foreign_key 'resources', 'resource_parents'
end
