export default function LinuxConfigPage() {
	return (
		<article className="prose max-w-prose mx-auto">
			<h1>Desktop Linux Setup</h1>

			<h2>Why and How did I Get Started?</h2>
			<p>
				I had a laptop in 2020 that was so terrible on battery life. I was familiar with
				linux and had used ubuntu several times and decided to install Arch and used suckless
				utilities all from scratch, and it improved my battery life by 2 more hours!
			</p>
			<p>
				It turns out that this was actually really fun. I liked tinkering and learning with
				how my computer actually worked from adjusting the screen brightness by writing to
				the /sys/class/backlight/... file and learning all about the difference between tty,
				terminal emulators, desktop environments vs window managers, and discovering how cool
				and personalized I could make my system. It is a fun hobby of mine.
			</p>
			<p>
				With this being said, here is a list of my favorite tools and utilities that I use on
				my system currently.
			</p>

			<h2>Hyprland Window Manager</h2>
			<p>
				I recently wanted to switch from Xorg to Wayland, and I have been following
				Hyprland&apos;s progress since near the beginning when I saw the project on Reddit. I
				think Wayland is in a stable enough state now that I am happy to try it out as my
				daily driver solely for the animations and configuration that Hyprland provides.
			</p>

			<h2>Neovim Configuration</h2>
			<p>
				My Neovim&apos;s base is nvchad. I started out with vim in about 2019, and loved it.
				It turned the physical act of writing code into a puzzle - how can I best edit this
				code? Is it ciw, should I record a macro, how fast can I be?
			</p>
			<p>
				In total, I have definitely lost a lot of time to configuring vim, but it has made
				coding so much more fun. The open source community is so inspiring, and impressing
				other software engineers is also pretty cool.
			</p>
			<p>
				I have a couple of changes and plugins now a days, but I honestly prefer a more base
				stated nvchad setup now.
			</p>

			<h2>TMUX</h2>
			<p>
				I originally didn&apos;t fully understand tmux. Why not just use tabs?
			</p>
			<p>A) Tmux when configured nicely looks really cool.</p>
			<p>
				B) Saving state in sessions is god tier. I do not have to worry about accidentally
				closing windows, and I can even ssh to my desktop remotely on my laptop when I need
				to compile rust code and don&apos;t want to wait for years at a time -- keeping my
				same sessions throughout. SSHing into my home server as well as vps providers is so
				much easier now.
			</p>
			<p>
				<em>
					*note: Zellij is cool too. I am not used to the keyboard shortcuts, and some of
					them conflict with my vim keybinds
				</em>
			</p>

			<h2>Terminal Utilities</h2>
			<p>A goal of mine is to use these more.</p>
			<p>
				yazi has been a nice terminal file manager and I am still trying to integrate it into
				my workflow more. I think integrations with firefox/chrome would make it much easier
				to do so.
			</p>
			<p>
				So far, eza and bat have completely replaced my use of ls and cat. I am trying to
				integrate fzf and thefuck more into my workflow but haven&apos;t gotten around to it
				much yet.
			</p>
			<p>
				I would love to hear about more of these newer gnu like utilities. Please reach out
				if you are working on one or know of new developing projects!
			</p>
			<p>
				See my config files{' '}
				<a href="https://github.com/ekhar/dots" target="_blank" rel="noreferrer">
					here
				</a>
			</p>
		</article>
	);
}
