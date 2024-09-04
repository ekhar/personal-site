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

![wolfenstein](/raycasting/wolf.gif)

This is a 3d game!... Right? Wrong! Carmack used a technique called **Raycasting** to render the game world from a 2d surface. Let's see the basics of how he and the other programmers approached this problem.

## Step 1: Draw a simple 2D map

In this step, we create a basic 2D representation of our game world. This is actually very simple from a computer science perspective. Here, we have a grid of 24x24 -- in the same league as chess's 8x8 grid. This forms the map.
<Step1 />

Different numbers in the grid equate to different colored walls. We will worry about visualizing those later. For now it is important to know they all lie on whole numbers. The character can walk around the grid with incremements of 0.1 so every 10 steps is a full square.

## Step 2: Implement DDA

![DDA](/raycasting/greek_vision.jpg)

The Ancient Greeks thought that vision were actually beems that shot out from our eyes. Think vizual echo location? Turns out they were correct! Well, correct in the case of video games. 3D games have to simulate light and the way to keep things efficient is to only simulate what you can see.

<Step2 />

So here is an example of one light beem shooting out from our eye. This seems simple right? Wrong! This is actually the core of how raycasting works.

In real life, we expect to throw something and if it hits an object it stops. Well, computers operate differently. We have to verify if the beem hits the target. We need to be able to accuratley tell whether or not this beem is hitting an object.

Here is an example of step sizes being too big. We missed the wall completely!

![missing](/raycasting/Too_big.excalidraw.svg)

Here is an example of step sizes being too small. We waste so much calculation and time. Imagine doing hundreds of extra checks for no reason. Think of the environment! And also your lack of frame rate!!

![missing](/raycasting/Too_small.excalidraw.svg)

Here is an example of step sizes being too many.

How do we do this? It is simple. We check every whole square.

![missing](/raycasting/JustRight.excalidraw.svg)
Maybe my drawing skills are not up to par, but Here we check every whole line. Because the walls are gaurenteed to be in a square, this means we do not waste checks!

This is called DDA (Digital Differential Analyzer if you want to sound smarter than you actually are.)

The math is pretty simple and follows Pythagorus right triangles. Basically, we look at the slope of the line. Slope is delta X / delta Y. If delta X is bigger than delta Y, that means that clearly Y is going to cross a whole number before X does. Same is true vise versa. We keep track of all our checks to make sure that we only check whole squares.

In other words, if big brother has bigger jumps on a sidwalk, the little brother is going to hit the sidewalk lines more frequently than big bro. Eventually big bro will hit it and we can track that with a bit of math. Remember, walls can only be on the sidewalk lines -- the whole numbers!

## Step 3: Render the single raycast

Okay. Now the fun part begins.

<Step3 />
So remember how we were going to create a 3d world? Well, we just need to render the color of what the light beem sees. The closer it is to us, render it bigger!For those who don't know, the distance formula is:

distance = sqrt(x^2 + y^2)

This is the distance from the player that the lines are at their stopping point. We can linearly scale this to vertical pixel height.

It's really that simple. So imagine if we made a whole bunch of these across the x-axis of our screen...

## Step 4: Implement and render full FOV raycasting

<Step4 />
Yes! We made it!! Minecraft (almost). So if we put a lot of these lines together we can render out the full scene. How many lines should we have?

Everywhere?

![missing](/raycasting/TooManyLooks.excalidraw.svg)

And how do we calculate this? Well this is called FOV (field of view). What we can do is imagine a screen in front of where our player is looking. This screen will represent our screen! It's width will map to our phyical viewing computer screen's width. This screen will be the bounds of our vision rays. The number of vision rays will be equal to the number of pixels on the screen we want to load it on!

![missing](/raycasting/Screen.excalidraw.svg)

Assuming a constant distance from the player, the wider the screen gets, the greater the FOV. Imagine a narrow screen creates a very tall triangle - vision like a hawk. A big screen creates a big triangle - vision like a cow. The screen's size dictates how wide our FOV gets. For most first person shooter's it is 66 degrees so that is what I chose to make it in the simulations.

Once we know how many rays get shot (again pixels on the screen), now we need to figure out the angles of each of them. This is actually quite simple.

We can "normalize" the screen into values ranging from -1 to 1. Say the screen was 100. We would make 50 = 0, 100 = 1, 0 = -1. The formula as we loop through the x pixels is 2 \* (x pixel we are on/number of x pixels) -1

Then we can use a little bit of Pythagorus and some addition to find the slope. It gets kind of confusing when you are looking 45 degrees northeast instead of straight up and down but this diagram hopefully makes it a bit more digestable. As you draw magic vision beams for every pixel on our screen, the slope of them changes a bit.

![missing](/raycasting/Angles.excalidraw.svg)

Well, now we know the light beem angles, and we know to draw them bigger if the light beem hits closer, we can combine this!

\*A note -- fish eye lense is a problem all raycasting techniques will have. You can't accuratley turn a 2d plane into a 3d world. The edges of your screen will have a greater distance calculated away. The way you solve this is by calculating the distance by extending out your imaginary character's camera plane axis and making the distance calculation based on that.

Now we can add some nice shading depending if the wall was on a row or column, and maybe a sprinkle of lighter as the object is closer and bam! Almost Wolfenstein achieved.

# The Meta

This was cool to code in. It is my first time writing code in web assembly and first time I've used golang in a little bit! It is not preformant nor optimized with go routines and gpu accelaration and shared buffer for wasm by any means haha but it was nice. Human creativity and a little bit of raw horsepower computation is amazing sometimes. Creating 3d worlds from 2d arrays is so cool.

In the future I think I might jump into network programming a bit and make this game playable with friends and maybe objectives. Who is to say... maybe doom style minecraft in the mix?

Thanks for reading this far :) Please hit me up if you enjoyed this or have ideas on this project, other projects, or just want to say hi -- ericsrealemail@gmail.com

For the code used to make the web assembly -- https://github.com/ekhar/personal-site/blob/main/src/lib/raycast_wasm/golang/raycasting.go

The components used to display it on screen in svelte - https://github.com/ekhar/personal-site/tree/main/src/posts/raycasting-tutorial

This would not be possible without the work of javidx9, https://www.youtube.com/watch?v=NbSee-XM7WA&t=1199s and https://lodev.org/cgtutor/raycasting.html
