# Front End API Hooks

This guide is an introduction to the various hooks availble for accessing the api in the front end.

## Hooks and API requests

[Hooks](https://reactjs.org/docs/hooks-intro.html) are a core piece of React provide a useful set of primitives for reusing logic across components.

API requests in Rhino use [axios](https://github.com/axios/axios) for networking and [react-query](https://react-query.tanstack.com/) to provide a robust asynchronous cache.

## Making API calls

Rhino provides five common hooks to match the five common CRUD actions, two for reading/querying data:

- useModelShow
- useModelIndex

and three for altering/mutating data:

- useModelCreate
- useModelUpdate
- useModelDestroy

## API Query Hooks

useModelShow and useModelIndex are built on top of [useQuery](https://react-query.tanstack.com/reference/useQuery) and return everything that this hook does.

### useModelShow

useModelShow takes 3 arguments:

```jsx
const { resource } = useModelShow(model, id, options);
```

- `model` a string for the model name or an already existing model object (from useModel or getModel)
- `id` a value for the id of the object to fetch (omitted or null for singular models)
- `options`
  - `networkOptions` a set of options passed to axios
  - `queryOptions` a set of options pased to useQuery (for instance to set the `enabled` option)

and in additon to the [useQuery](https://react-query.tanstack.com/reference/useQuery) returns, useModelShow returns:

- `model` a memoized model used to construct the query
- `resource` a memoized copy of the model (or null if not yet available)

### useModelIndex

useModelIndex takes 2 arguments:

```jsx
const { resources } = useModelIndex(model, options);
```

- `model` a string for the model name or an already existing model object (from useModel or getModel)
- `options`
  - `networkOptions` a set of options passed to axios
  - `queryOptions` a set of options pased to useQuery (for instance to set the `enabled` option)

and in additon to the [useQuery](https://react-query.tanstack.com/reference/useQuery) returns, useModelIndex returns:

- `model` a memoized model used to construct the query
- `resources` a memoized copy the model list object from the api with results and total (resources.results, resources.total) (or null if not yet available)
- `results` a memoized copy of results (or null if not yet available)
- `total` a memoized copy of total - the total number of matching objects regardless of pagination (or null if not yet available)

#### Recipes

##### Passing Filters

```jsx
const { resources } = useModelIndex(model, {
  networkOptions: {
    params: {
      filter: {
        published: true,
      },
      order: "name",
    },
  },
});
```

##### Disabling a Query

```jsx
const { resources } = useModelIndex(model, {
  queryOptions: { enabled: !!user },
});
```

See also: [Dependent Queries](https://react-query.tanstack.com/guides/dependent-queries#_top)

##### Refreshing More Frequently

```jsx
const { resources } = useModelIndex(model, {
  queryOptions: { refetchInterval: 15 * 1000 },
});
```

### Checking status

It may be tempting to do something like:

```jsx

const { resource } = useModelShow('blog', 23);

if (!resource) return <Spinner>;
```

but it is better to rely on the status checks in react-query:

```jsx
const { isSuccess, resource } = useModelShow('blog', 23);

if (!isSuccess) return <Spinner>;
```

## API Mutation Hooks

useModelCreate, useModelUpdate and useModelDestroy are built on top of [useMutation](https://react-query.tanstack.com/reference/useMutation) and return everything that this hook does.

The API also returns the object in its form post-mutation so you can react to the new state.

### useModelCreate

useModelCreate takes 2 arguments:

```jsx
const { mutation } = useModelCreate(model, mutationOptions);
```

- `model` a string for the model name or an already existing model object (from useModel or getModel)
- `mutationOptions` a set of options pased to useMutation (for instance to set the `enabled` option)

and in additon to the [[useMutation](https://react-query.tanstack.com/reference/useMutation) returns, useModelCreate returns:

- `model` a memoized model used to construct the query
- `resource` a memoized copy of the model (or null if not yet available)

#### Recipes

##### Acting On Success

```jsx
const { mutate } = useModelCreate("blog_post");

const handleCreate = () => mutate({name "test"}, {onSuccess: (data) => console.log("Created id", data?.data?.id)})
```

### useModelUpdate

useModelUpdate takes 2 arguments:

```jsx
const { mutation } = useModelUpdate(model, mutationOptions);
```

- `model` a string for the model name or an already existing model object (from useModel or getModel)
- `mutationOptions` a set of options pased to useMutation (for instance to set the `enabled` option)

and in additon to the [useMutation](https://react-query.tanstack.com/reference/useMutation) returns, useModelUpdate returns:

- `model` a memoized model used to construct the query
- `resource` a memoized copy of the model (or null if not yet available)

When calling the mutation:

```jsx
const { mutate } = useModelUpdate("blog_post");

const handleSave = () => mutate({id: 4, name "test"})
```

the object passed to mutate _must_ contain and id field.

#### Recipes

##### Acting On Success

```jsx
const { mutate } = useModelUpdate("blog_post");

const handleSave = () => mutate({id: 4, name "test"}, {onSuccess: (data) => console.log("Updated name to", data?.data?.name)})
```

### useModelDestroy

useModelDestroy takes 2 arguments:

```jsx
const { mutation } = useModelDestroy(model, mutationOptions);
```

- `model` a string for the model name or an already existing model object (from useModel or getModel)
- `mutationOptions` a set of options pased to useMutation (for instance to set the `enabled` option)

and in additon to the [useMutation](https://react-query.tanstack.com/reference/useMutation) returns, useModelDestroy returns:

- `model` a memoized model used to construct the query
- `resource` a memoized copy of the model (or null if not yet available)

When calling the mutation:

```jsx
const { mutate } = useModelDestroy("blog_post");

const handleDelete = () => mutate({ id: 4 });
```

the object passed to mutate _must_ contain and id field.

#### Recipes

##### Acting On Success

```jsx
const { mutate } = useModelDestroy("blog_post");

const handleDelete = () =>
  mutate(
    { id: 4 },
    {
      onSuccess: (data) =>
        console.log("Destroyed object with name", data?.data?.name),
    }
  );
```

## Building Custom Hooks

The built in CRUD hooks themselves are composed of several lower level hooks, all of which can be re-used to build your own more customized hooks, for instance:

```jsx
export const usePublishedBlogPosts = () => {
  return useModelIndex("blog_post", {
    networkOptions: {
      params: {
        filter: {
          published: true,
        },
      },
    },
  });
};
```
