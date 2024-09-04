---
title: Raycasting With WebAssembly
description: My first foray into computer graphics
date: '2024-09-01'
categories:
  - graphics
  - webassembly
  - go
published: true
---

<script>
  import Step1 from './raycasting-tutorial/TwoDMap.svelte';
  import Step2 from './raycasting-tutorial/DDA.svelte';
  import Step3 from './raycasting-tutorial/SingleRaycast.svelte';
  import Step4 from './raycasting-tutorial/FullFOV.svelte';
</script>

## **Today I am going to try to implement my first 3d game **

## Let's start at the end and see how we got here

<Step4 />

## A bit of background

I have looked up to programmers like John Carmack, Acerola, and Sabastian Lague for a while now. I think creating beautiful and interactive worlds with art is so cool. Not to mention this brings a nice bridge between my wanting to improve at physics along with getting better at coding!

Carmack either invented or popularized the first 3d game that really took advantage of **Raycasting**. The computers back then were waaaaayyyy too slow and memory innefficient to ever produce true state of the art 4k 3d rendering. So, in 1992 (pre internet and 9 years pre me) Wolfenstein is released and breaks people's minds.

//insert gif of wolfenstein

This is a 3d game!... Right? Wrong! Carmack used a technique called **Raycasting** to render the game world from a 2d surface. Let's see the basics of how he and the other programmers approached this problem.

## Step 1: Draw a simple 2D map

In this step, we create a basic 2D representation of our game world. This is actually very simple from a computer science perspective. Here, we have a grid of 24x24 -- in the same league as chess's 8x8 grid. This forms the map.
<Step1 />

Different numbers in the grid equate to different colored walls. We will worry about visualizing those later. For now it is important to know they all lie on whole numbers. The character can walk around the grid with incremements of 0.1 so every 10 steps is a full square.

## Step 2: Implement DDA

The Ancient Greeks thought that vision were actually beems that shot out from our eyes and bounced back. Turns out they were correct! Well, correct in the case of video games. 3D games have to simulate light and the way to keep things efficient is to only simulate what you can see.

<Step2 />

So here is an example of one light beem shooting out from our eye. This seems simple right? Wrong! This is actually the core of how raycasting works.

In real life, we expect to throw something and if it hits an object it stops. Well, computers operate differently. We have to verify if the beem hits the target. We need to be able to accuratley tell whether or not this beem is hitting an object.

//insert image of missing

How do we do this? It is simple. We check every whole square.

//insert image of DDA

The math is pretty simple and follows Pythagorus right triangles. Basically, we look at the slope of the line. Slope is delta X / delta Y. If delta X is bigger than delta Y, that means that clearly Y is going to cross a whole number before X does. Same is true vise versa. We keep track of all our checks to make sure that we only check whole squares.

In other words, if big brother has bigger jumps on a sidwalk, the little brother is going to hit the sidewalk lines more frequently than big bro. Eventually big bro will hit it and we can track that with a bit of math. Remember, walls can only be on the sidewalk lines -- the whole numbers!

Here is some of my source code (written in golang) if you want to have fun
//insert golang code

## Step 3: Render the single raycast

Okay. Now the fun part begins.

<Step3 />
So remember how we were going to create a 3d world? Well, we just need to render the color of what the light beem sees. The closer it is to us, render it bigger! It's really that simple. So imagine if we made a whole bunch of these...

## Step 4: Implement and render full FOV raycasting

<Step4 />
Yes! We made it!! Minecraft (almost). So if we put a lot of these lines together we can render out the full scene. Of course, nothing is that simple. Remember the distance I talked about earlier?
