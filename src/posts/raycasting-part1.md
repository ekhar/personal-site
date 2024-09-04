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

## **Today I am going to try to implement my first 3D game**

## Let's start at the end and see how we got here

<Step4 />

## A bit of background

I have looked up to programmers like John Carmack, Acerola, and Sebastian Lague for a while now. I think creating beautiful and interactive worlds with art is so cool. Not to mention, this brings a nice bridge between my desire to improve at physics along with getting better at coding!

Carmack either invented or popularized the first 3D game that really took advantage of **Raycasting**. The computers back then were way too slow and memory inefficient to ever produce true state-of-the-art 4K 3D rendering. So, in 1992 (pre-internet and nine years pre-me), Wolfenstein was released and blew people's minds.

![wolfenstein](/raycasting/wolf.gif)

This is a 3D game!... Right? Wrong! Carmack used a technique called **Raycasting** to render the game world from a 2D surface. Let's see the basics of how he and the other programmers approached this problem.

## Step 1: Draw a simple 2D map

In this step, we create a basic 2D representation of our game world. This is quite simple from a computer science perspective. Here, we have a grid of 24x24, similar to a chessboard's 8x8 grid. This forms the map.
<Step1 />

Different numbers in the grid equate to different colored walls. We will worry about visualizing those later. For now, it is important to know they all lie on whole numbers. The character can walk around the grid with increments of 0.1, so every 10 steps is a full square.

## Step 2: Implement DDA

![DDA](/raycasting/greek_vision.jpg)

The Ancient Greeks thought that vision consisted of beams that shot out from our eyes. Think of visual echolocation! It turns out they were correct — well, correct in the case of video games. 3D games have to simulate light, and the way to keep things efficient is to only simulate what you can see.

<Step2 />

Here is an example of one light beam shooting out from our eye. This seems simple, right? Wrong! This is actually the core of how raycasting works.

In real life, we expect to throw something, and if it hits an object, it stops. Well, computers operate differently. We have to verify if the beam hits the target. We need to accurately determine whether or not this beam is hitting an object.

Here is an example of step sizes being too big. We missed the wall completely!

![missing](/raycasting/Too_big.excalidraw.svg)

Here is an example of step sizes being too small. We waste so much calculation and time. Imagine doing hundreds of extra checks for no reason. Think of the environment! And also your lack of frame rate!

![missing](/raycasting/Too_small.excalidraw.svg)

How do we fix this? It's simple. We check every whole square.

![missing](/raycasting/JustRight.excalidraw.svg)

Maybe my drawing skills are not up to par, but here we check every whole line. Because the walls are guaranteed to be in a square, this means we do not waste checks!

This is called DDA (Digital Differential Analyzer if you want to sound smarter than you actually are).

The math is pretty simple and follows Pythagoras's right triangles. Basically, we look at the slope of the line: Slope = ΔX / ΔY. If ΔX is greater than ΔY, then Y will cross a whole number before X does, and vice versa. We keep track of all our checks to ensure that we only check whole squares.

In other words, if a big brother has bigger jumps on a sidewalk, the little brother will hit the sidewalk lines more frequently than the big brother. Eventually, the big brother will hit it, and we can track that with a bit of math. Remember, walls can only be on the sidewalk lines — the whole numbers!

## Step 3: Render the single raycast

Okay. Now the fun part begins.

<Step3 />

So remember how we were going to create a 3D world? Well, we just need to render the color of what the light beam sees. The closer it is to us, the bigger it is rendered! For those who don't know, the distance formula is:

`distance = sqrt(x^2 + y^2)`

This is the distance from the player to the point where the lines stop. We can linearly scale this to vertical pixel height.

It's really that simple. So imagine if we made a whole bunch of these across the x-axis of our screen...

## Step 4: Implement and render full FOV raycasting

<Step4 />

Yes! We made it! Minecraft (almost). So, if we put a lot of these lines together, we can render out the full scene. How many lines should we have?

Everywhere?

![missing](/raycasting/TooManyLooks.excalidraw.svg)

How do we calculate this? Well, this is called FOV (Field of View). Imagine a screen in front of where our player is looking. This screen will represent our screen! Its width will map to our physical viewing computer screen's width. This screen will be the bounds of our vision rays. The number of vision rays will equal the number of pixels on the screen we want to load it on!

![missing](/raycasting/Screen.excalidraw.svg)

Assuming a constant distance from the player, the wider the screen, the greater the FOV. A narrow screen creates a very tall triangle — vision like a hawk. A big screen creates a big triangle — vision like a cow. The screen's size dictates how wide our FOV gets. For most first-person shooters, it is 66 degrees, so that is what I chose for the simulations.

Once we know how many rays get shot (again, pixels on the screen), we need to figure out the angles of each of them. This is quite simple.

We can "normalize" the screen into values ranging from -1 to 1. Say the screen was 100 pixels wide. We would make 50 = 0, 100 = 1, 0 = -1. The formula as we loop through the x pixels is `2 * (x pixel we are on / number of x pixels) - 1`.

Then, using a bit of Pythagoras and some addition, we can find the slope. It gets kind of confusing when you are looking 45 degrees northeast instead of straight up and down, but this diagram should make it a bit more digestible. As you draw magic vision beams for every pixel on our screen, the slope of them changes slightly.

![missing](/raycasting/Angles.excalidraw.svg)

Now that we know the light beam angles, and know to draw them bigger if the light beam hits closer, we can combine this!

_Note:_ Fish-eye lens is a problem all raycasting techniques will have. You can't accurately turn a 2D plane into a 3D world. The edges of your screen will have a greater distance calculated away. You solve this by calculating the distance by extending out your imaginary character's camera plane axis and making the distance calculation based on that.

Now we can add some nice shading depending on whether the wall was on a row or column, and perhaps a bit of lightening as the object gets closer, and bam! Almost Wolfenstein achieved.

## The Meta

This was cool to code. It is my first time writing code in WebAssembly and the first time I've used Go in a while! It is not performant nor optimized with Go routines, GPU acceleration, or shared buffers for WASM by any means, but it was a nice exercise. Human creativity and a little bit of raw computational horsepower are amazing sometimes. Creating 3D worlds from 2D arrays is so cool.

In the future, I might dive into network programming a bit and make this game playable with friends and maybe add objectives. Who knows... maybe a Doom-style Minecraft in the mix?

Thanks for reading this far! :) Please hit me up if you enjoyed this, have ideas on this project or other projects, or just want to say hi: ericsrealemail@gmail.com.

For the code used to make the WebAssembly, check out: [raycasting.go](https://github.com/ekhar/personal-site/blob/main/src/lib/raycast_wasm/golang/raycasting.go)

The components used to display it on the screen in Svelte can be found here: [Svelte Components](https://github.com/ekhar/personal-site/tree/main/src/posts/raycasting-tutorial)

This project would not be possible without the work of [javidx9](https://www.youtube.com/watch?v=NbSee-XM7WA&t=1199s) and the excellent tutorial at [Lodev's Raycasting Tutorial](https://lodev.org/cgtutor/raycasting.html).
