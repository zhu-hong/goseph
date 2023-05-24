package service

import (
	"os"
	"path/filepath"
)

var CachePath string

func init() {
	if cacheDir, err := os.UserCacheDir(); err == nil && len(cacheDir) != 0 {
		cachePath := filepath.Join(cacheDir, "goseph-cache")
		if err := os.MkdirAll(cachePath, os.ModePerm); err != nil {
			CachePath = getExeDir()
		} else {
			CachePath = cachePath
		}
	} else {
		CachePath = getExeDir()
	}
}

// 程序运行目录
func getExeDir() string {
	exe, _ := os.Executable()
	return filepath.Dir(exe)
}
