# Update from Rhino

This guided is for projects that were based on Rhino and need to get code updates from Rhino's repositories. Both client and server work in the same way regarding code updates.

## General idea

The idea behind this process is to have a branch set up to track Rhino repository's master branch and merge it with the existing code whenever needed. In case changes need to be done after the merge, only one commit (after the generated merge commit) is supposed to be added to the history, therefore a rebase and squash is recommended.

## Preparation

#### 1. The project needs to have its own repository

#### 2. Add Rhino's repository as a remote named `boilerplate`.

For the server:

```
git remote add boilerplate git@github.com:nubinary/boilerplate_server.git
```

Or for the client:

```
git remote add boilerplate git@github.com:nubinary/boilerplate_client.git
```

#### 3. Fetch the `master` branch from Rhino and name it `boilerplate-master` locally:

```
git fetch boilerplate master:boilerplate-master
```

#### 4. Set the newly created `boilerplate-master` branch to track its upstream branch `master`, from Rhino's origin:

```
git branch --set-upstream-to=boilerplate/master boilerplate-master
```

## Update Process

#### 1. Get the latest updates from Rhino's repository

```
git checkout boilerplate-master
git pull
```

#### 2. Create a ticket (in Jira, Trello, etc.) just for the update, e.g. `[NUB-777] Update from boilerplate`

#### 3. Create and checkout a new branch just for the update **from the project's `master` branch**

```
git checkout master
git checkout -b task/NUB-777
```

#### 4. Merge the updated `boilerplate-master` into the newly created branch:

```
git merge boilerplate-master
```

Now it's a good time to review the introduced changes and to test the application to make sure nothing was broken.

### Easy path

If it's all working well and no changes are needed to accomodate the new code from Rhino, just open a PR (probably to master) for the newly created branch.

### Hard path

There will be some cases where changes will need to be made to the existing code to integrate correctly with Rhino. In these cases, you might end up making one or more commits and might want to rebase and squash them. Rhino has a suggestion on how to do this.

By examining `git log` **after** doing the merge command it's possible to see that the last commit is in fact a merge commit:

```
commit 1b4134524d465b02a795d57c3c06de29960352a7
Merge: fa486dd6 62bab999
Author: Person NuBinary <person@nubinary.com>
Date:   Mon Jan 10 20:29:39 2022 -0300

    Merge branch 'boilerplate-master' into task/NUB-777
```

If it's necessary to make changes after the merge, it's recommended to use as git message the name of the task. That way, `git log` would end up with this fix commit as the last one and with the merge commit right after it like so:

```
commit 36676eab4e68e8d3959aee4a8a66a5265882f09f (HEAD -> task/NUB-777)
Author: Person NuBinary <person@nubinary.com>
Date:   Tue Jan 11 09:52:37 2022 -0300

    [NUB-777] Update from boilerplate

commit 1b4134524d465b02a795d57c3c06de29960352a7
Merge: fa486dd6 62bab999
Author: Person NuBinary <person@nubinary.com>
Date:   Mon Jan 10 20:29:39 2022 -0300

    Merge branch 'boilerplate-master' into task/NUB-777
```

If that is the state of `git log`, then there isn't anything else to be done and it is recommended to open the PR just like this. However, in case there are more commits and you want to rebase and squash them, you might find the state of `git log` like this:

```
commit 6feb48197a71742803a04af5dac2a2338012356b
Author: Person NuBinary <person@nubinary.com>
Date:   Tue Jan 11 09:52:37 2022 -0300

    more and more fixes

commit abc8a2ba2112f5e03f3ece20c9e35c76c2717196
Author: Person NuBinary <person@nubinary.com>
Date:   Tue Jan 11 09:52:37 2022 -0300

    fixes

commit 36676eab4e68e8d3959aee4a8a66a5265882f09f
Author: Person NuBinary <person@nubinary.com>
Date:   Tue Jan 11 09:52:37 2022 -0300

    [NUB-777] Update from boilerplate

commit 1b4134524d465b02a795d57c3c06de29960352a7
Merge: fa486dd6 62bab999
Author: Person NuBinary <person@nubinary.com>
Date:   Mon Jan 10 20:29:39 2022 -0300

    Merge branch 'boilerplate-master' into task/NUB-777
```

Then, you're probably going to need to squash the last 3 commits (i.e. `6feb48197a71742803a04af5dac2a2338012356b`, `abc8a2ba2112f5e03f3ece20c9e35c76c2717196` and `36676eab4e68e8d3959aee4a8a66a5265882f09f`) into one single commit with the message being `[NUB-777] Update from boilerplate`. **It's really important that you keep the merge commit intact**, so you will have to rebase from `1b4134524d465b02a795d57c3c06de29960352a7` (merge commit) and up:

```
git rebase -i 1b4134524d465b02a795d57c3c06de29960352a7
```

This command would not include the merge commit (a.k.a `1b4134524d465b02a795d57c3c06de29960352a7`) in the rebase, but only the commits that came after it. Git will open the interactive rebase process, in which you want to pick the first commit and squash all the others. By saving it, you would see the commit message file, in which you want to leave the actual final commit message (`[NUB-777] Update from boilerplate`) and comment all the other ones.

After the rebase is done, you can just check `git log` again and see that there's only one commit after the merge commit and that is the final commit with the task's message:

```
commit 525333f9c584a5434eda9311b6e44c7382798203
Author: Person NuBinary <person@nubinary.com>
Date:   Tue Jan 12 01:12:32 2022 -0300

    [NUB-777] Update from boilerplate

commit 1b4134524d465b02a795d57c3c06de29960352a7
Merge: fa486dd6 62bab999
Author: Person NuBinary <person@nubinary.com>
Date:   Mon Jan 10 20:29:39 2022 -0300

    Merge branch 'boilerplate-master' into task/NUB-777
```

It is expected that the commit hash from `[NUB-777] Update from boilerplate` just changes, as that's exactly what `git rebase` does - re-writes the history.

Finally, you can open the PR.
