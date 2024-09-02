package main

import (
	"math"
	"syscall/js"
)

const (
	mapWidth     = 24
	mapHeight    = 24
	screenWidth  = 640
	screenHeight = 480
)

var worldMap = [mapWidth][mapHeight]int{
	{1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
	{1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
	{1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
	{1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
	{1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 3, 0, 3, 0, 3, 0, 0, 0, 1},
	{1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
	{1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 1},
	{1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
	{1, 0, 0, 0, 0, 0, 2, 2, 0, 2, 2, 0, 0, 0, 0, 3, 0, 3, 0, 3, 0, 0, 0, 1},
	{1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
	{1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
	{1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
	{1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
	{1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
	{1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
	{1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
	{1, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
	{1, 4, 0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
	{1, 4, 0, 0, 0, 0, 5, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
	{1, 4, 0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
	{1, 4, 0, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
	{1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
	{1, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
	{1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
}

var (
	posX, posY     float64 = 22, 12
	dirX, dirY     float64 = -1, 0
	planeX, planeY float64 = 0, 0.66
)

func main() {
	c := make(chan struct{}, 0)
	js.Global().Set("draw2d_map", js.FuncOf(draw2d_map))
	//TODO: This should render and draw a map with the player at the correct position. It should be 2d with black borders and he map should be a grid array with 1-5 being different colored blocks, 0 being white. It should also spawn a player being a red dot

	js.Global().Set("move_player", js.FuncOf(move_player))
	//TODO: This should be a function that takes in wasd. w = forward, a= spin left, s = spin right, d = spin right. It should move the player in the direction the user is pressing. It should also be able to move the player to a specific position. The player should be the same red dot referenced earlier.

	js.Global().Set("dda_single", js.FuncOf(dda_single))
	//TODO: This should render a single raycast using dda alorithm going in the same direction as the direction vector. Render this on the 2d map
	js.Global().Set("dda_fov", js.FuncOf(dda_single))
	//TODO: This should render a range of raycast using dda alorithm with the fov selected
	//these will be the rendering algorithms. they assume draw2d_map is already rendered. it will be a live view into the rendering of what can be seen on the map
	js.Global().Set("render_dda_single", js.FuncOf(render_dda_single))
	//TODO: This should render a single raycast on the screen
	js.Global().Set("render_dda_fov", js.FuncOf(render_dda_fov))
	//TODO: This should render a range of raycasts on the screen basically the full implementation of the algorithm

	<-c
}

func draw2d_map(this js.Value, args []js.Value) interface{} {
	// TODO: Implement 2D map rendering
	return nil
}

func move_player(this js.Value, args []js.Value) interface{} {
	// TODO: Implement player movement
	return nil
}

func dda_single(this js.Value, args []js.Value) interface{} {
	// TODO: Implement single raycast using DDA algorithm
	return nil
}

func dda_fov(this js.Value, args []js.Value) interface{} {
	// TODO: Implement FOV raycasting using DDA algorithm
	return nil
}

func render_dda_single(this js.Value, args []js.Value) interface{} {
	// TODO: Implement rendering of single raycast on screen
	return nil
}

func render_dda_fov(this js.Value, args []js.Value) interface{} {
	// TODO: Implement rendering of FOV raycasts on screen
	return nil
}
