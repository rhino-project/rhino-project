# frozen_string_literal: true

class RhinoSieveTestHelper < ActionDispatch::IntegrationTest
  protected

  def sign_in
    @current_user = create :user
    post '/api/auth/sign_in', params: {
      email: @current_user.email,
      password: @current_user.password
    }, as: :json
    @headers = { 'access-token' => @response.headers['access-token'],
                 'uid' => @response.headers['uid'],
                 'client' => @response.headers['client'] }
  end

  def seed
    # creating blog1 and blog2, for example
    @instance1 = create_instance
    @instance2 = create_instance

    # creating blog_post1 and blog_post2 for blog1
    @nested_instance1 = create_nested_instance @instance1
    @nested_instance2 = create_nested_instance @instance1

    # creating blog_post3 and blog_post2 for blog2
    @nested_instance3 = create_nested_instance @instance2
  end

  def setup
    sign_in
    seed
  end

  def fetch
    get url, params: { 'filter' => @params }, headers: @headers
    assert_response :ok
    @json = JSON.parse(@response.body)
  end

  def expect_results_from_instance1
    fetch
    assert_equal 2, @json['total']
    assert_equal 2, @json['results'].length

    nested_ids = response_ids
    instance_ids = response_ids_from_key instance_name

    assert_equal [@instance1.id, @instance1.id], instance_ids
    assert_equal [@nested_instance1.id, @nested_instance2.id].sort, nested_ids
  end

  def expect_results_from_instance2
    fetch
    assert_equal 1, @json['total']
    assert_equal 1, @json['results'].length

    nested_ids = response_ids
    instance_ids = response_ids_from_key instance_name

    assert_equal [@instance2.id], instance_ids
    assert_equal [@nested_instance3.id].sort, nested_ids
  end

  # rubocop:disable Metrics/AbcSize
  def expect_results_from_all
    fetch
    assert_equal 3, @json['total']
    assert_equal 3, @json['results'].length

    expected_instances = [@instance1.id, @instance1.id, @instance2.id]
    expected_nested = [
      @nested_instance1.id,
      @nested_instance2.id,
      @nested_instance3.id
    ].sort
    assert_equal expected_instances, response_ids_from_key(instance_name)
    assert_equal expected_nested, response_ids
  end
  # rubocop:enable Metrics/AbcSize

  def expect_empty
    fetch
    assert_equal 0, @json['total']
    assert_equal 0, @json['results'].length
  end

  def response_ids
    @json['results'].map { |el| el['id'] }.sort
  end

  def response_ids_from_key(key)
    @json['results'].map { |el| el[key]['id'] }.sort
  end
end

# rubocop:disable Metrics/ClassLength
class RhinoSieveFilterOneToManyTest < RhinoSieveTestHelper
  def url
    '/api/blog_posts'
  end

  def instance_name
    'blog'
  end

  def create_instance
    create :blog, user: @current_user
  end

  def create_nested_instance(instance)
    create :blog_post, blog: instance
  end

  def expect_results_from_blog1
    expect_results_from_instance1
  end

  def expect_results_from_blog2
    expect_results_from_instance2
  end

  test "should work with the name of the relationship as key and id as value e.g. '?filter[blog]=1'" do
    sign_in
    seed

    @params = { 'blog' => @instance1.id }
    expect_results_from_blog1

    @params = { 'blog' => @instance2.id }
    expect_results_from_blog2
  end

  test "works with the id as a nested field e.g. '?filter[blog][id]=1'" do
    sign_in
    seed

    @params = { 'blog' => { 'id' => @instance1.id } }
    expect_results_from_blog1

    @params = { 'blog' => { 'id' => @instance2.id } }
    expect_results_from_blog2
  end

  test "works with any nested field and the default operation is eq e.g. '?filter[blog][title]=something'" do
    @params = { 'blog' => { 'title' => @instance1.title } }
    expect_results_from_blog1

    # using wrong id
    @params = { 'blog' => {
      'id' => @instance1.id,
      'title' => @instance2.title
    } }
    expect_empty

    # fixing id
    @params['blog']['id'] = @instance2.id
    expect_results_from_blog2
  end

  test "works with when default operation is eq with array e.g. '?filter[blog][id][]=1&filter[blog][id][]=2'" do
    # single item
    @params = { 'blog' => {
      'id' => [@instance1.id]
    } }
    expect_results_from_blog1

    # multiple items
    @params = { 'blog' => {
      'id' => [@instance1.id, @instance2.id]
    } }
    expect_results_from_all
  end

  test "accepts operator gt e.g. '?filter[blog][created_at][gt]=1999-12-31'" do
    @instance1.update created_at: '1999-12-31'
    @instance2.update created_at: '2000-01-01'

    @params = { 'blog' => {
      'created_at' => { 'gt' => '1999-12-31' }
    } }
    expect_results_from_blog2
  end

  test "accepts operator lt e.g. '?filter[blog][created_at][lt]=1999-12-31'" do
    @instance1.update created_at: '1999-12-31'
    @instance2.update created_at: '2000-01-01'

    @params = { 'blog' => {
      'created_at' => { 'lt' => '2000-01-01' }
    } }
    expect_results_from_blog1
  end

  test 'accepts combinations of operators lt and gt' do
    @instance1.update created_at: '1999-12-31'
    @instance2.update created_at: '2000-01-01'
    create :blog, created_at: '2001-01-01'

    @params = { 'blog' => {
      'created_at' => {
        'gt' => '1999-01-01',
        'lt' => '2000-12-31'
      }
    } }
    expect_results_from_all # doesn't include the newly created blog
  end

  test "accepts operator gteq e.g. '?filter[blog][created_at][gteq]=1999-12-31'" do
    @instance1.update created_at: '1999-12-31'
    @instance2.update created_at: '2000-01-01'

    @params = { 'blog' => {
      'created_at' => { 'gteq' => '1999-12-31' }
    } }
    expect_results_from_all
  end

  test "accepts operator lteq e.g. '?filter[blog][created_at][lteq]=1999-12-31'" do
    @instance1.update created_at: '1999-12-31'
    @instance2.update created_at: '2000-01-01'

    @params = { 'blog' => {
      'created_at' => { 'lteq' => '2000-01-01' }
    } }
    expect_results_from_all
  end

  test "accepts operator eq e.g. '?filter[blog][title][eq]=1999-12-31'" do
    @params = { 'blog' => {
      'title' => { 'eq' => @instance1.title }
    } }
    expect_results_from_blog1
  end

  test "accepts operator diff e.g. '?filter[blog][title][diff]=1999-12-31'" do
    @params = { 'blog' => {
      'title' => {
        'diff' => @instance1.title
      }
    } }
    expect_results_from_blog2
  end

  test 'ignores any unknown field' do
    @params = { 'foo' => 'bar' }
    expect_results_from_all
  end

  test "works with aliased fields like in blog post's aliased_creation_date <> created_at" do
    # from blog 1
    @nested_instance1.update created_at: '1900-01-01'
    @nested_instance2.update created_at: '1900-01-01'
    # from blog 2
    @nested_instance3.update created_at: '2021-05-04'

    conditions = { 'gt' => '2000-01-01' }
    @params = { 'created_at' => conditions }
    expect_results_from_blog2

    @params = { 'aliased_creation_date' => conditions }
    expect_results_from_blog2
  end
end
# rubocop:enable Metrics/ClassLength
