---
title: "⛩ Being a happy, pragmatic and ego-less dev"
date: "2020-02-10T22:12:03.284Z"
description: "Now that I have a few years of programming under the hood and having gone through many companies, projects, teams, countless sprint plannings, stand up meetings, refactorings, there is a few things I wish I knew earlier"
---

Now that I have a few years of programming under my belt and have worked for many companies, projects, teams and participated in countless sprint plannings, stand up meetings and refactoring sessions, there are a few things I wish I knew earlier.

This article is both a letter to my old self on how to approach becoming a senior developer and a written testament of my ability to see my stupidity and slightly take a step back from it from time to time (not too much though)

I'm not saying you shouldn't give a f\*\*k about your job, I'm just saying you should pick your battles.

##### Disclaimer: I have personally been in all the situations described in this article.

![ok](./Untitled.png)

## End users don't care about the framework

Stop trying to use this new framework / pattern / package you read about on hacker news the night before and shove it down the throat of your coworkers who just want to go through the day without having to rollback the production database just before the week-end.

In my (short) developer ~~career~~ adventure I think nothing has been more time consuming and idiotic than some of my peer's (and sometimes my) obsession with the latest trend of serverless lambda gateway kubernetes fuckery ™️

![lol](<./download_(1).png>)

While we are at it, you probably don't need microservices and swarms of small repos (I should make a t-shirt and go to meetups with it). Stop thinking everybody pushing back on your brilliant idea is an unlightened idiot when trying to get a company to switch to a swarm of small repos instead of a simple monolith. While it may look good on paper, getting people to work in perfect harmony in this configuration is almost utopic, and I'm not even talking about QA and deployment. Also, it's not because you read online that each service needs its own repository and database that you HAVE to do it this way and rack up a \$3k monthly AWS bill for your 7 people startup. There is nothing wrong with using Heroku and a single repo.

Bashing Php / Java / Any other languages than your preferred one just makes you look weak. A php developer is not automatically a inferior human being because you are using React and Redux.
If it's such a shit language compared to your beloved Go / JS / Rust then why Facebook, Wordpress, x and y use it daily ?

You should definitely have opinions about your favorite stack and tools but you should also understand that you work in a team, for a company, on a large project, that programming is older than you are, trends come and go and a framework isn't automatically obsolete after 5 years of existence. More importantly, you should be aware that even if a framework looks amazing, you should be extremely careful when choosing and ask these questions:

- Is there a large community behind the tool ?
- Can the tool be shutdown or discontinued by a single company ?
- Is there a pool of developers with expertise on this tool your company can easily access when growing ?
- Are you trying to get this new tool adopted in your organisation because it would look good when introducing yourself at meetups ?

## Stop reinventing the wheel

[picture of a perfect wheel with awesome design and ugly drawing of your half assed wheel because you thought it would be easy to redo a tool 500 people spent 3 years building]

You stumble upon an npm package, quickly read the readme sideways, then think "meh, I can do it better" and start coding your own router for React Native because the standard ones don't seem to implement that one feature you want and you have plenty of time to ship the project anyway, so it's fine, right ?

Six months down the road, everybody hates you for locking down the whole project on a custom tool that has 0 documentation, is buggy and has 0 developer support in the outside world and any core library update breaks the whole flow.

The costs of building a tool yourself can be far greater than time spent on the initial implementation. Let's face it, when 500 people spent 3 years building a great tool downloaded thousands of time a day on NPM you probably won't be able to make a better and more complete one in a couple of weeks as a junior dev.

## It's ok not to work in a Fortune 500 company

![https://polygons.servebox.com/images/better-place.gif](https://polygons.servebox.com/images/better-place.gif)

Stop pretending you are at the very edge of your field, pushing the frontier and exploring new continents when your job is to build React components for a cool but small project in a large company. I've fallen into this trap myself of overblowing stuff to find purpose in my job. Reading all day long about top 1% programmers working on life saving projects and / or at billion dollar companies can turn your head upside down. It's ok to work for a regular company that isn't on Hacker News top page every other day

## Performances are very often the least of your concerns

Let's be honest, if you're not working on life saving medical equipments, self driving cars or real time rendering but on a food delivery app, obsessing on benchmarking two components to shave off a couple of millisecs of rendering when your auth is a complete mess is a waste of time.

I'm not saying you should completely ignore performance concerns and become a lazy dev' but learn to say stop optimizing something just to flatter your ego rather than helping your users.
