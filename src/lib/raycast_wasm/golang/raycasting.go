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
	js.Global().Set("updateRaycasting", js.FuncOf(updateRaycasting))
	<-c
}

func updateRaycasting(this js.Value, args []js.Value) interface{} {
	canvasWidth := args[0].Int()
	canvasHeight := args[1].Int()

	buffer := make([]byte, canvasWidth*canvasHeight*4)

	for x := 0; x < canvasWidth; x++ {
		cameraX := 2*float64(x)/float64(canvasWidth) - 1
		rayDirX := dirX + planeX*cameraX
		rayDirY := dirY + planeY*cameraX

		mapX := int(posX)
		mapY := int(posY)

		sideDistX := 0.0
		sideDistY := 0.0

		deltaDistX := math.Abs(1 / rayDirX)
		deltaDistY := math.Abs(1 / rayDirY)
		perpWallDist := 0.0

		stepX := 0
		stepY := 0

		hit := 0
		side := 0

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

		for hit == 0 {
			if sideDistX < sideDistY {
				sideDistX += deltaDistX
				mapX += stepX
				side = 0
			} else {
				sideDistY += deltaDistY
				mapY += stepY
				side = 1
			}
			if worldMap[mapX][mapY] > 0 {
				hit = 1
			}
		}

		if side == 0 {
			perpWallDist = (float64(mapX) - posX + (1-float64(stepX))/2) / rayDirX
		} else {
			perpWallDist = (float64(mapY) - posY + (1-float64(stepY))/2) / rayDirY
		}

		lineHeight := int(float64(canvasHeight) / perpWallDist)

		drawStart := -lineHeight/2 + canvasHeight/2
		if drawStart < 0 {
			drawStart = 0
		}
		drawEnd := lineHeight/2 + canvasHeight/2
		if drawEnd >= canvasHeight {
			drawEnd = canvasHeight - 1
		}

		var color byte
		switch worldMap[mapX][mapY] {
		case 1:
			color = 255 // red
		case 2:
			color = 128 // green
		case 3:
			color = 0 // blue
		case 4:
			color = 192 // light gray
		default:
			color = 64 // dark gray
		}

		if side == 1 {
			color = color / 2
		}

		for y := drawStart; y < drawEnd; y++ {
			index := (y*canvasWidth + x) * 4
			buffer[index] = color
			buffer[index+1] = color
			buffer[index+2] = color
			buffer[index+3] = 255
		}
	}

	uint8Array := js.Global().Get("Uint8Array").New(len(buffer))
	js.CopyBytesToJS(uint8Array, buffer)

	return uint8Array
}

func movePlayer(this js.Value, args []js.Value) interface{} {
	x := args[0].Float()
	y := args[1].Float()

	newX := posX + x*0.1
	newY := posY + y*0.1

	if newX >= 0 && newX < mapWidth && worldMap[int(newX)][int(posY)] == 0 {
		posX = newX
	}
	if newY >= 0 && newY < mapHeight && worldMap[int(posX)][int(newY)] == 0 {
		posY = newY
	}

	return nil
}

func init() {
	js.Global().Set("movePlayer", js.FuncOf(movePlayer))
}
