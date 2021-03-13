# Rhino Notifications

This guide is an introduction to Rhino Notifications module

## Activity Notification Gem

Rhino Notifications uses the [activity_notification](https://github.com/simukappu/activity_notification) gem for notifications.

### Integrating Rhino Notifications

Rhino Notifications can be added by the following steps:

1. Install Rhino Notifications module using this command: `rails rhino_notifications:install` then use `rails db:migrate` to complete migration of the newly added model.

### Implementation Notes

You likely want to specify the `dependent_notifications` option on your `acts_as_notifiable` model if the they are destroyable. `dependent_notifications: :update_group_and_destroy` is safe option.

You should set `notifiable_path` to the path you would like to you to go when the notification is 'opened'. The rhino resource method `route_frontend` can be used to do this.
