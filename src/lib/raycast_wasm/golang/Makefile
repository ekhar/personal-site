run: player_map

player_map:
	GOOS=js GOARCH=wasm go build -o ../../../static/wasm/player-map.wasm player_map.go

multiple:
	GOOS=js GOARCH=wasm go build -o ../../../static/wasm/multiple-raycasts.wasm multiple_raycasts.go

dda:
	GOOS=js GOARCH=wasm go build -o ../../../static/wasm/movable-character.wasm movable_character.go
