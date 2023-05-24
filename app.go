package main

import (
	"context"
	"net"
	"os/exec"
	"runtime"
	"strings"

	api "goseph/api"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) GetMaybeLocalIP() (ip string) {
	conn, _ := net.Dial("udp", "8.8.8.8:53")

	defer conn.Close()

	localAddr := conn.LocalAddr().(*net.UDPAddr)
	ip = strings.Split(localAddr.String(), ":")[0]

	return
}

func (a *App) GetIPs() (ips []string) {
	addrs, _ := net.InterfaceAddrs()

	for _, address := range addrs {
		if ipnet, ok := address.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				ips = append(ips, ipnet.IP.String())
			}
		}
	}

	return
}

func (a *App) OpenCacheDir() {
	if runtime.GOOS == "windows" {
		exec.Command("explorer", api.CachePath).Start()
	} else if runtime.GOOS == "darwin" {
		exec.Command("open", api.CachePath).Start()
	}
}
