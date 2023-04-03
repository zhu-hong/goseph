package main

import (
	"context"
	"goseph/service"
	"net"
	"strings"
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

	service.RunService()
}

func (a *App) GetIP() (ip string) {
	conn, err := net.Dial("udp", "8.8.8.8:53")
	if err != nil {
		return err.Error()
	}

	localAddr := conn.LocalAddr().(*net.UDPAddr)
	ip = strings.Split(localAddr.String(), ":")[0]

	return
}

func (a *App) GetIPs() (ips []string) {
	addrs, _ := net.InterfaceAddrs()

	for _, address := range addrs {
		// check the address type and if it is not a loopback the display it
		if ipnet, ok := address.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				ips = append(ips, ipnet.IP.String())
			}
		}
	}

	return
}
