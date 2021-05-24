# Override for React

This guide is an introduction to override for React

## What are overrides

Overrides are implemented in Rhino as hooks to allow developers to customize props and some components for model CRUD actions. Offering all of this functionality through a single unified overrides prop gives developers a consistent place to perform simple customization for things such as field ordering in forms or to provide a different layout for displaying the index page.

### Configuration

Overrides can be customized in 'src/hooks/overrides.js'. The overrides are implemented in all the components regarding models such as create, updates, edit, index and show.
To override props or component edit 'globalOverrides'. ( Find the variable in 'models/overrides.js')

### Configuration example

Let's try to override 'show' component for a specific model like blogs. By default, all the _readable_ props are expected to be shown by the order that they are sent in API. With the right globalOverrides and without changing API, developeers are able to change the order of props. To do so, add the code snippet below to globalOverriden:

```
const globalOverrides = {
  blog: {
    index: {
      ModelIndexTable: {
        ModelTable: {
          props: {
            paths: [
              'author.display_name',
              'category.display_name',
              'title',
              'published_at'
            ]
          }
        }
      }
    },
    show: {
      ModelShowDescription: {
        props: {
          paths: ['author', 'title', 'category', 'published_at']
        }
      }
    }
  }
};
```

Another use case is to pass customized components to be the specific component of a model. Paths can also be functions and receive the same set of props a ModelFormField would.

Taking the later example, let's add some customization to edit form. Create your functions at 'src/pages/editBlogForm.js'

```
import React from 'react';
import { Alert } from 'reactstrap';
import { Button } from 'components/buttons';

export const editBlogForm = ( model ) => {
  return (
    <Alert color="primary">
      Changes in {model} might need admin approval.
    </Alert>
  );
};

export const changeAlert = () => {
  return <Button to={'some/other/page'}>Check Permissions</Button>;
};
```

and update _globalOverrides_ like below:

```
import { editBlogForm, changeAlert } from 'pages/editBlogFrom';

const globalOverrides = {
  blog: {
    index: {
      ModelIndexTable: {
        ModelTable: {
          props: {
            paths: [
              'author.display_name',
              'category.display_name',
              'title',
              'published_at'
            ]
          }
        }
      }
    },
    edit: {
      ModelEditForm: {
        props: {
          paths: [
            () => editBlogForm('blog'),
            'title',
            'category',
            'published_at',
            'author',
            () => changeAlert()
          ]
        }
      }
    },
    show: {
      ModelShowDescription: {
        props: {
          paths: ['author', 'title', 'category', 'published_at']
        }
      }
    }
  }
};

export default globalOverrides;

```

So we managed to add alerts and action button to Blogs edit page but passing the function in globalOverrides

### Read more

- [A sample library](https://github.com/tlrobinson/overrides)
- [Better Reusable React Components with the Overrides Pattern](https://dschnurr.medium.com/better-reusable-react-components-with-the-overrides-pattern-9eca2339f646)
