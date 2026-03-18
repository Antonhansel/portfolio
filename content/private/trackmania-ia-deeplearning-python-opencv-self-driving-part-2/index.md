---
title: 🏎 Trackmania Self Driving Car
date: "2020-09-26T22:12:03.284Z"
private: true
description: "Can you make a car in Trackmania drive itself with 0 knowledge of IA ? Let's find out"
---

If you haven't read part 1 and you care about the prequel of this series, go read it ![go read it](https://antonin.cool/trackmania-ia-deeplearning-python-opencv-self-driving/). It's basically about how to read video game frames, process the images and extract relevant data such as lanes and speed / distance.

### Step 0 - Setup and thoughts

The goal of this project is to <del>impress Elon</del> give enough data to a computer so it can drive a car in Trackmania.

**The very high level steps I'll be taking are:**

- Take a screenshot of the game
- Clean and analyze the screenshot to extract as much data as possible (lanes, speed, time, etc...)
- Feed the data into some sort of a IA
- Let the IA output some commands to the game
- Make a system to notifiy the IA when the car is stuck (fail) or when the track is finished (success)
- Let it run on it's own for a while

### Step 1: Reading game frames with OpenCV

