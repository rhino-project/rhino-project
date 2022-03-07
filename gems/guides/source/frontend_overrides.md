# Override for React

This guide is an introduction to override for React

## What are overrides

Overrides are implemented in Rhino as hooks to allow developers to customize props and some components for model CRUD actions. Offering all of this functionality through a single unified overrides prop gives developers a consistent place to perform simple customization for things such as field ordering in forms or to provide a different layout for displaying the index page.

### Configuration

Overrides can be customized in `src/hooks/overrides.js`. The overrides are implemented in all the components regarding models such as create, updates, edit, index and show.
To override props or component edit `globalOverrides`. ( Find the variable in `models/overrides.js`)

### Override paths and add components to paths

Let's try to override `show` component for a specific model like blogs. By default, all the _readable_ props are expected to be shown by the order that they are sent in API. With the right globalOverrides and without changing API, developeers are able to change the order of props. To do so, add the code snippet below to globalOverriden:

```javascript
const globalOverrides = {
  blog: {
    index: {
      ModelIndexTable: {
        ModelTable: {
          props: {
            paths: [
              "author.display_name",
              "category.display_name",
              "title",
              "published_at",
            ],
          },
        },
      },
    },
    show: {
      ModelShowDescription: {
        props: {
          paths: ["author", "title", "category", "published_at"],
        },
      },
    },
  },
};
```

Another use case is to pass customized components to be the specific component of a model. Paths can also be functions and receive the same set of props a ModelFormField would.

Taking the later example, let's add some customization to edit form. Create your functions at `src/pages/editBlogForm.js`

```javascript
import React from "react";
import { Alert } from "reactstrap";
import { Button } from "components/buttons";

export const editBlogForm = (model) => {
  return (
    <Alert color="primary">Changes in {model} might need admin approval.</Alert>
  );
};

export const changeAlert = () => {
  return <Button to={"some/other/page"}>Check Permissions</Button>;
};
```

and update _globalOverrides_ like below:

```javascript
import { editBlogForm, changeAlert } from "pages/editBlogFrom";

const globalOverrides = {
  blog: {
    index: {
      ModelIndexTable: {
        ModelTable: {
          props: {
            paths: [
              "author.display_name",
              "category.display_name",
              "title",
              "published_at",
            ],
          },
        },
      },
    },
    edit: {
      ModelEditForm: {
        props: {
          paths: [
            () => editBlogForm("blog"),
            "title",
            "category",
            "published_at",
            "author",
            () => changeAlert(),
          ],
        },
      },
    },
    show: {
      ModelShowDescription: {
        props: {
          paths: ["author", "title", "category", "published_at"],
        },
      },
    },
  },
};

export default globalOverrides;
```

So we managed to add alerts and action button to Blogs edit page but passing the function in globalOverrides

### Paths as a function

`paths` can be an array of string (or functions) or a **function that returns an array**. It can receive as arguments the current user's roles and the resources in context. For instance, `paths` related to `create` would receive `null`as `resource`, whereas the `edit` case would lead to `resource` being the current record. For `index`, the list of resources would be passed.

For example, if it was desired to hide some fileds from non-admin users:

```javascript
const globalOverrides = {
  blog: {
    index: {
      ModelIndexTable: {
        ModelTable: {
          props: {
            paths: (roles, resource) => {
              if (roles.includes("admin")) {
                return ["title", "category", "published_at", "author"];
              }
              return [["title", "author"]];
            },
          },
        },
      },
    },
  },
};
```

It's also possible to show/hide fields based on the resource state:

```javascript
const globalOverrides = {
  blog: {
    edit: {
      ModelForm: {
        props: {
          paths: (roles, resource) => {
            if (resource.published_at != null) {
              return ["title", "category", "author"];
            }
            return ["title", "category", "published_at", "author"];
          },
        },
      },
    },
  },
};
```

### Override components

It is possible to override components of a significant model and its actions. To do so, add `component: componentName` to the desired model action like the example below:

```
import ModelIndexCard from 'components/models/ModelIndexCard';

const globalOverrides = {
  blog: {
    index: {
      ModelIndexTable: {
        component: ModelIndexCard,
        props: {
          paths: ['title', 'category', 'published_at']
        }
      }
    }
  }
};

```

In the above example the predefined component `ModelIndexCard` is imported to override blogs indexing view instead of `ModelIndexTable`. By applying this component override, blogs indexing would show card-based view instead of table-based one.

### Read more

- [A sample library](https://github.com/tlrobinson/overrides)
- [Better Reusable React Components with the Overrides Pattern](https://dschnurr.medium.com/better-reusable-react-components-with-the-overrides-pattern-9eca2339f646)
