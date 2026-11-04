# Original development history

`original-development.bundle` preserves all 47 commits reachable from the original source HEAD, including their original author metadata. `COMMITS.txt` lists those commits chronologically.

Source HEAD at export: `d278f1f2bc0ea97db7ed26e92be9b9c41c8bbcf3`.

To recover the original repository into a separate directory:

```sh
git bundle verify history/original-development.bundle
git clone history/original-development.bundle ../top-down-tanks-original
git -C ../top-down-tanks-original log --oneline
```

The bundle advertises HEAD rather than a named branch, so a clone may use a detached HEAD. To start a local development branch in that recovered checkout:

```sh
git -C ../top-down-tanks-original switch -c recovered-development
```

The GitHub default branch contains the latest source plus portfolio documentation. Original commits are archived, not recreated as GitHub contributions or attributed to a different author. Runtime databases, secrets, and deployment artifacts are not included. The source and its history were scanned for common credential patterns before export; no matches were found.
