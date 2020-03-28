# Flutter Package Updater

![.github/workflows/test-drive.yml](https://github.com/tianhaoz95/update-flutter-packages/workflows/.github/workflows/test-drive.yml/badge.svg?branch=master)
[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/tianhaoz95/update-flutter-packages) 

## Background

[Dependabot](https://dependabot.com/) is a great way to automatically keep dependencies up-to-date, but the support for Flutter is still under construction (hopefully).

## Solution

For the time being, I put together this action to automate package updating for Flutter projects.

The action scans the default (master) branch and opens pull requests to update all packages defined in `pubspec.yml`.

The actions requires:
* `subosito/flutter-action@v1`
* `actions/setup-java@v1`
* `actions/checkout@v1`

## Example

```yml
on:
  schedule:
    - cron: 0 2 * * *
jobs:
  test:
    name: example Flutter package updater
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: actions/setup-java@v1
        with:
          java-version: '12.x'
      - uses: subosito/flutter-action@v1
        with:
          flutter-version: '1.12.13+hotfix.5'
          channel: 'stable'
      - name: run flutter package updater
        uses: tianhaoz95/update-flutter-packages@v0.0.1
        with:
          flutter-project: './sample_flutter_app'
          git-email: 'tianhaoz@umich.edu'
          git-name: 'Tianhao Zhou'
          token: ${{ secrets.TIANHAOZ_GITHUB_TOKEN }}
```

## Happy hacking!

Spend your time on what matters, let automation take care the rest ;)