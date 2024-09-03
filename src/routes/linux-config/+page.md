<script lang="ts">
    import {base } from '$app/paths';
</script>

# Desktop Linux Setup

## **Why and How did I Get Started?**

I had a laptop in 2020 that was so terrible on battery life. I was familiar with linux and had used ubuntu several times and decided to install Arch and used suckless utilities all from scratch, and it improved my battery life by 2 more hours!

It turns out that this was actually really fun. I liked tinkering and learning with how my computer actually worked from adjusting the screen brightness by writing to the /sys/class/backlight/... file and learning all about the difference between tty, terminal emulators, desktop environments vs window managers, and discovering how cool and personolized I could make my system. It is a fun hobby of mine.

With this being said, here is a list of my favorite tools and utilities that I use on my system currently.

## **Hyprland Window Manager**

I recently wanted to switch from Xorg to Wayland, and I have been following Hyprland's progress since near the beginning when I saw the project on Reddit.
I think Wayland is in a stable enough state now that I am happy to try it out as my daily driver soley for the animations and configuration that Hyprland Provides.

<video width="100%" controls>
  <source src="linux-config/images/output.webm" type="video/webm">
  <source src="linux-config/images/output.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## **Neovim Configuration**

My Neovim's base is nvchad. I started out with vim in about 2019, and loved it. It turned the physical act of writing code
into a puzzle - how can I best edit this code? Is it ciw, should I record a macro, how fast can I be?

In total, I have definitely lost a lot of time to configuring vim, but it has made coding so much more fun. The open source community is
so inspiring, and imporessing other software engineers is also pretty cool.

I have a couple of changes and plugins now a days, but I honestly prefer a more base stated nvchad setup now.

## **TMUX**

I originally didn't fully understand tmux. Why not just use tabs?

A) Tmux when configured nicley looks really cool.

B) Saving state in sessions is god tier. I do not have to worry about accidently closing windows, and I can even ssh to my desktop remotley on my laptop when I need to compile rust code and don't want to wait for years at a time -- keeping my same sessions throughout. SSHing into my home server as well as vps providers is so much easier now.

\*note: Zellij is cool too. I am not used to the keyboard shortcuts, and some of them conflict with my vim keybinds

## **Terminal Utilities**

A goal of mine is to use these more.

yazi has been a nice terminal file manager and I am still trying to integrate it into my workflow more. I think integrations with firefox/chrome would make it much easier to do so.

So far, eza and bat have completely replaced my use of ls and cat. I am trying to integrate fzf and thefuck more into my workflow but haven't gotten around to it much yet.

I would love to hear about more of these newer gnu like utilities. Please reach out if you are working on one or know of new developing projects!

See my config files [here](https://github.com/ekhar/dots)
