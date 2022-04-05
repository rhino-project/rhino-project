# Rhino Jobs

This guide is an introduction to Rhino Jobs

## Jobs

ActiveJob on top of resque is the basis for async and scheduled jobs in Rhino Jobs.

More details at https://nubinary.github.io/rhino-guides/active_job_basics.html

### Installation

`rails rhino_jobs:install`

### Creating a job

`rails g job Test`

### Running a job

TestJob.perform_later

### Scheduling a job

Edit resque_schedule.yml. See https://github.com/JustinAiken/active_scheduler for more details.

### Processing the queue

The queued jobs `COUNT=1 QUEUE=* bundle exec rails resque:workers`.

The scheduled jobs `bundle exec rails resque:scheduler`

On Heroku, Procfile is already updated for this.
