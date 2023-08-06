package main

import (
	"fmt"
)

func mainx() {
	var n = 0
	var start = 1
	var end = 100
	var step = 1
	for i := start; i <= end; i += step {
		n += i
	}
	fmt.Println("")
	fmt.Println(n)
}
