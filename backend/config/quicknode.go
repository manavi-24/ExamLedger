package config

import (
	"log"

	"github.com/ethereum/go-ethereum/rpc"
)

// ConnectQuickNode initializes a connection to QuickNode
func ConnectQuickNode() *rpc.Client {
	// Replace with your actual QuickNode RPC URL
	rpcURL := "https://spring-shy-voice.ethereum-holesky.quiknode.pro/97efd17afa07e578c0e82a454a041d7442826404"

	client, err := rpc.Dial(rpcURL)
	if err != nil {
		log.Fatalf("Failed to connect to QuickNode: %v", err)
	}

	log.Println("✅ Successfully connected to QuickNode")
	return client
}
