package main

import (
	"fmt"
	"math"
	"strconv"
	"strings"
	"syscall/js"
)

const (
	mapWidth  = 24
	mapHeight = 24
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
	js.Global().Set("move_player", js.FuncOf(move_player))
	js.Global().Set("dda_single", js.FuncOf(dda_single))
	js.Global().Set("dda_fov", js.FuncOf(dda_fov))
	js.Global().Set("render_dda_single", js.FuncOf(render_dda_single))
	js.Global().Set("render_dda_fov", js.FuncOf(render_dda_fov))

	<-c
}

func draw2d_map(this js.Value, args []js.Value) interface{} {
	ctx := args[0]
	scale := args[1].Float()
	cellSize := 20 * scale // Size of each cell in pixels, scaled

	// Clear the canvas
	ctx.Call("clearRect", 0, 0, float64(mapWidth)*cellSize, float64(mapHeight)*cellSize)

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
			ctx.Call("fillRect", float64(x)*cellSize, float64(y)*cellSize, cellSize, cellSize)
		}
	}

	// Draw grid lines
	ctx.Set("strokeStyle", "rgba(200, 200, 200, 0.3)") // Light grey with 30% opacity
	ctx.Set("lineWidth", scale)

	// Draw vertical lines
	for x := 0; x <= mapWidth; x++ {
		ctx.Call("beginPath")
		ctx.Call("moveTo", float64(x)*cellSize, 0)
		ctx.Call("lineTo", float64(x)*cellSize, float64(mapHeight)*cellSize)
		ctx.Call("stroke")
	}

	// Draw horizontal lines
	for y := 0; y <= mapHeight; y++ {
		ctx.Call("beginPath")
		ctx.Call("moveTo", 0, float64(y)*cellSize)
		ctx.Call("lineTo", float64(mapWidth)*cellSize, float64(y)*cellSize)
		ctx.Call("stroke")
	}

	// Draw the player
	playerX := posX * cellSize
	playerY := posY * cellSize
	playerSize := 6.0 * scale

	// Draw player circle
	ctx.Set("fillStyle", "red")
	ctx.Call("beginPath")
	ctx.Call("arc", playerX, playerY, playerSize, 0, 2*math.Pi)
	ctx.Call("fill")

	// Draw direction arrow
	arrowLength := playerSize * 2
	arrowEndX := playerX + dirX*arrowLength
	arrowEndY := playerY + dirY*arrowLength

	ctx.Set("strokeStyle", "yellow")
	ctx.Set("lineWidth", 2*scale)
	ctx.Call("beginPath")
	ctx.Call("moveTo", playerX, playerY)
	ctx.Call("lineTo", arrowEndX, arrowEndY)
	ctx.Call("stroke")

	// Draw arrowhead
	arrowheadSize := playerSize * 0.8
	ctx.Call("beginPath")
	ctx.Call("moveTo", arrowEndX, arrowEndY)
	ctx.Call("lineTo",
		arrowEndX-dirX*arrowheadSize+dirY*arrowheadSize*0.6,
		arrowEndY-dirY*arrowheadSize-dirX*arrowheadSize*0.6)
	ctx.Call("lineTo",
		arrowEndX-dirX*arrowheadSize-dirY*arrowheadSize*0.6,
		arrowEndY-dirY*arrowheadSize+dirX*arrowheadSize*0.6)
	ctx.Call("closePath")
	ctx.Set("fillStyle", "black")
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
	scale := args[1].Float()
	cellSize := float64(20) * scale // Size of each cell in pixels, scaled

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
	ctx.Set("lineWidth", 2*scale) // Scale the line width
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

	ctx := args[0]
	scale := args[1].Float()
	cellSize := float64(20) * scale // Size of each cell in pixels, scaled
	screenWidth := args[2].Float()

	// Get the FOV results using the internal DDA function
	fovResults := dda_fov_internal(screenWidth)

	// Calculate start point for the lines
	startX := posX * cellSize
	startY := posY * cellSize

	// Draw the FOV rays
	for _, result := range fovResults {
		// Calculate the exact hit point
		endX := posX + result.rayDirX*result.dist
		endY := posY + result.rayDirY*result.dist

		// Convert to pixel coordinates
		endX *= cellSize
		endY *= cellSize

		// Draw the line
		ctx.Call("beginPath")
		ctx.Set("strokeStyle", "rgba(255, 0, 0, 0.3)") // Semi-transparent red
		ctx.Set("lineWidth", 1*scale)                  // Scale the line width
		ctx.Call("moveTo", startX, startY)
		ctx.Call("lineTo", endX, endY)
		ctx.Call("stroke")
	}

	return nil
}

type FOVResult struct {
	dist    float64
	mapX    int
	mapY    int
	side    bool
	rayDirX float64
	rayDirY float64
}

func dda_fov_internal(screenWidth float64) []FOVResult {
	// TODO: Implement FOV raycasting using DDA algorithm
	ret := []FOVResult{}
	for x := 0; x < int(screenWidth); x++ {

		mapX, mapY := int(posX), int(posY)

		var stepX, stepY int
		var sideDistX, sideDistY float64
		//cameraX calculation right side is 1 center is 0 left is -1
		cameraX = (float64(x)/screenWidth)*2 - 1
		rayDirX := dirX + planeX*cameraX
		rayDirY := dirY + planeY*cameraX
		// Avoid division by zero
		if rayDirX == 0 {
			rayDirX = 0.00001
		}
		if rayDirY == 0 {
			rayDirY = 0.00001
		}

		deltaDistX := math.Abs(1 / rayDirX)
		deltaDistY := math.Abs(1 / rayDirY)

		if rayDirX < 0 {
			stepX = -1
			sideDistX = (posX - float64(mapX)) * deltaDistX
		} else {
			stepX = 1
			sideDistX = (float64(mapX) + 1.0 - posX) * deltaDistX
		}
		if rayDirY < 0 {
			stepY = -1
			sideDistY = (posY - float64(mapY)) * deltaDistY
		} else {
			stepY = 1
			sideDistY = (float64(mapY) + 1.0 - posY) * deltaDistY
		}

		// Main DDA loop
		hit := false
		side := false
		maxDistance := 100.0 // Maximum ray distance to prevent infinite loops
		distance := 0.0

		for !hit && distance < maxDistance {
			if sideDistX < sideDistY {
				sideDistX += deltaDistX
				mapX += stepX
				side = false
			} else {
				sideDistY += deltaDistY
				mapY += stepY
				side = true
			}

			// Check bounds before accessing worldMap
			if mapX < 0 || mapX >= mapWidth || mapY < 0 || mapY >= mapHeight {
				break
			}

			if worldMap[mapY][mapX] > 0 {
				hit = true
			}

		}

		// Calculate perpendicular wall distance
		// if side == 0 {
		// 	distance = (float64(mapX) - posX + (1-float64(stepX))/2) / dirX
		// } else {
		// 	distance = (float64(mapY) - posY + (1-float64(stepY))/2) / dirY
		// }
		if !side {
			distance = (float64(mapX) - posX + (1-float64(stepX))/2) / rayDirX
		} else {
			distance = (float64(mapY) - posY + (1-float64(stepY))/2) / rayDirY
		}

		data := FOVResult{distance, mapX, mapY, side, rayDirX, rayDirY}
		ret = append(ret, data) // Corrected append operation
	}

	return ret

}

// Helper function to parse RGB values from a color string
func parseRGB(color string) (int, int, int) {
	color = strings.TrimPrefix(color, "rgb(")
	color = strings.TrimSuffix(color, ")")
	parts := strings.Split(color, ",")
	r, _ := strconv.Atoi(strings.TrimSpace(parts[0]))
	g, _ := strconv.Atoi(strings.TrimSpace(parts[1]))
	b, _ := strconv.Atoi(strings.TrimSpace(parts[2]))
	return r, g, b
}

func render_dda_single(this js.Value, args []js.Value) interface{} {
	ctx := args[0]
	scale := args[1].Float()
	screenWidth := float64(args[2].Int())
	screenHeight := float64(args[3].Int())

	distance, mapX, mapY := dda_single_internal()

	// Calculate wall height
	wallHeight := (screenHeight / distance) * scale
	if wallHeight > screenHeight {
		wallHeight = screenHeight
	}

	// Calculate draw start and end positions
	drawStart := -wallHeight/2 + screenHeight/2
	if drawStart < 0 {
		drawStart = 0
	}
	drawEnd := wallHeight/2 + screenHeight/2
	if drawEnd >= screenHeight {
		drawEnd = screenHeight - 1
	}

	// Determine wall color based on worldMap value
	var color string
	switch worldMap[mapY][mapX] {
	case 1:
		color = "rgb(0,0,0)" // Black
	case 2:
		color = "rgb(0,0,255)" // Blue
	case 3:
		color = "rgb(0,255,0)" // Green
	case 4:
		color = "rgb(255,255,0)" // Yellow
	default:
		color = "rgb(255,255,255)" // White
	}

	// Apply shading based on distance
	shade := 1.0 / (distance * 0.1)
	if shade > 1 {
		shade = 1
	}
	ctx.Set("fillStyle", applyShade(color, shade))

	// Draw the vertical line
	ctx.Call("fillRect", screenWidth/2, drawStart, 1, drawEnd-drawStart)

	return nil
}

// Helper function to apply shading to a color
func applyShade(color string, shade float64) string {
	r, g, b := parseRGB(color)
	r = int(float64(r) * shade)
	g = int(float64(g) * shade)
	b = int(float64(b) * shade)
	return fmt.Sprintf("rgb(%d,%d,%d)", r, g, b)
}

func render_dda_fov(this js.Value, args []js.Value) interface{} {
	ctx := args[0]
	scale := args[1].Float()
	screenWidth := float64(args[2].Int())
	screenHeight := float64(args[3].Int())

	fovResults := dda_fov_internal(screenWidth)

	for x, result := range fovResults {
		distance := result.dist
		mapX := result.mapX
		mapY := result.mapY
		side := result.side

		// Calculate wall height
		wallHeight := (screenHeight / distance) * scale
		if wallHeight > screenHeight {
			wallHeight = screenHeight
		}

		// Calculate draw start and end positions
		drawStart := -wallHeight/2 + screenHeight/2
		if drawStart < 0 {
			drawStart = 0
		}
		drawEnd := wallHeight/2 + screenHeight/2
		if drawEnd >= screenHeight {
			drawEnd = screenHeight - 1
		}

		// Determine wall color based on worldMap value
		var color string
		switch worldMap[mapY][mapX] {
		case 1:
			color = "rgb(0,0,0)" // Black
		case 2:
			color = "rgb(0,0,255)" // Blue
		case 3:
			color = "rgb(0,255,0)" // Green
		case 4:
			color = "rgb(255,255,0)" // Yellow
		default:
			color = "rgb(255,255,255)" // White
		}

		// Apply shading based on distance and side
		shade := 1.0 / (distance * 0.1)
		if shade > 1 {
			shade = 1
		}
		if side {
			shade *= 0.7 // Darken sides hit
		}
		ctx.Set("fillStyle", applyShade(color, shade))

		// Draw the vertical line
		ctx.Call("fillRect", float64(x), drawStart, 1, drawEnd-drawStart)
	}

	return nil
}
