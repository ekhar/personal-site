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
	posX, posY       float64 = 22, 12
	dirX, dirY       float64 = -1, 0
	planeX, planeY   float64 = 0, 0.66
	time, oldTime    float64 = 0, 0
	cameraX, cameraY float64 = 0, 0
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
	ctx := args[0]
	cellSize := 20 // Size of each cell in pixels

	// Clear the canvas
	ctx.Call("clearRect", 0, 0, mapWidth*cellSize, mapHeight*cellSize)

	// Draw the map
	for y := 0; y < mapHeight; y++ {
		for x := 0; x < mapWidth; x++ {
			cellType := worldMap[y][x]
			switch cellType {
			case 1:
				ctx.Set("fillStyle", "black")
			case 2:
				ctx.Set("fillStyle", "blue")
			case 3:
				ctx.Set("fillStyle", "green")
			case 4:
				ctx.Set("fillStyle", "yellow")
			case 5:
				ctx.Set("fillStyle", "purple")
			default:
				ctx.Set("fillStyle", "white")
			}
			ctx.Call("fillRect", x*cellSize, y*cellSize, cellSize, cellSize)
		}
	}

	// Draw the player
	ctx.Set("fillStyle", "red")
	playerX := int(posX * float64(cellSize))
	playerY := int(posY * float64(cellSize))
	playerSize := 6
	ctx.Call("beginPath")
	ctx.Call("arc", playerX, playerY, playerSize, 0, 2*math.Pi)
	ctx.Call("fill")

	return nil
}

func move_player(this js.Value, args []js.Value) interface{} {

	moveY := args[0].Float()
	rotate := args[1].Float()

	// Movement speed and rotation speed
	moveSpeed := 0.10
	rotSpeed := 0.10

	// Move forward/backward
	if moveY != 0 {
		newX := posX + dirX*moveY*moveSpeed
		newY := posY + dirY*moveY*moveSpeed

		// Check for collision
		if worldMap[int(newY)][int(posX)] == 0 {
			posY = newY
		}
		if worldMap[int(posY)][int(newX)] == 0 {
			posX = newX
		}
	}

	// Rotate left/right
	if rotate != 0 {
		// Rotate direction vector
		oldDirX := dirX
		dirX = dirX*math.Cos(rotate*rotSpeed) - dirY*math.Sin(rotate*rotSpeed)
		dirY = oldDirX*math.Sin(rotate*rotSpeed) + dirY*math.Cos(rotate*rotSpeed)

		// Rotate camera plane
		oldPlaneX := planeX
		planeX = planeX*math.Cos(rotate*rotSpeed) - planeY*math.Sin(rotate*rotSpeed)
		planeY = oldPlaneX*math.Sin(rotate*rotSpeed) + planeY*math.Cos(rotate*rotSpeed)
	}

	return nil
}

func dda_single(this js.Value, args []js.Value) interface{} {
	ctx := args[0]
	cellSize := float64(20) // Size of each cell in pixels

	// Get the ray's end point using the internal DDA function
	distance, _, _ := dda_single_internal()

	// Calculate start and end points for the line
	startX := posX * cellSize
	startY := posY * cellSize

	// Calculate the exact hit point
	endX := posX + dirX*distance
	endY := posY + dirY*distance

	// Convert to pixel coordinates
	endX *= cellSize
	endY *= cellSize

	// Draw the black line
	ctx.Call("beginPath")
	ctx.Set("strokeStyle", "black")
	ctx.Set("lineWidth", 2)
	ctx.Call("moveTo", startX, startY)
	ctx.Call("lineTo", endX, endY)
	ctx.Call("stroke")

	return nil
}

func dda_single_internal() (float64, int, int) {
	mapX, mapY := int(posX), int(posY)

	// Avoid division by zero
	if dirX == 0 {
		dirX = 0.00001
	}
	if dirY == 0 {
		dirY = 0.00001
	}

	deltaDistX := math.Abs(1 / dirX)
	deltaDistY := math.Abs(1 / dirY)

	var stepX, stepY int
	var sideDistX, sideDistY float64

	if dirX < 0 {
		stepX = -1
		sideDistX = (posX - float64(mapX)) * deltaDistX
	} else {
		stepX = 1
		sideDistX = (float64(mapX) + 1.0 - posX) * deltaDistX
	}
	if dirY < 0 {
		stepY = -1
		sideDistY = (posY - float64(mapY)) * deltaDistY
	} else {
		stepY = 1
		sideDistY = (float64(mapY) + 1.0 - posY) * deltaDistY
	}

	// Main DDA loop
	hit := false
	side := 0
	maxDistance := 100.0 // Maximum ray distance to prevent infinite loops
	distance := 0.0

	for !hit && distance < maxDistance {
		if sideDistX < sideDistY {
			sideDistX += deltaDistX
			mapX += stepX
			side = 0
		} else {
			sideDistY += deltaDistY
			mapY += stepY
			side = 1
		}

		// Check bounds before accessing worldMap
		if mapX < 0 || mapX >= mapWidth || mapY < 0 || mapY >= mapHeight {
			break
		}

		if worldMap[mapY][mapX] > 0 {
			hit = true
		}

		distance += 0.1 // Increment distance to avoid infinite loops
	}

	// Calculate perpendicular wall distance
	if side == 0 {
		distance = (float64(mapX) - posX + (1-float64(stepX))/2) / dirX
	} else {
		distance = (float64(mapY) - posY + (1-float64(stepY))/2) / dirY
	}

	return distance, mapX, mapY
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
