package config

// IPFS_API_URL is the Pinata endpoint to upload files to IPFS.
// This is your custom gateway, but it's only for accessing content.
// You CANNOT use it as an upload endpoint.
// For uploading, use the Pinata API: https://api.pinata.cloud/pinning/pinFileToIPFS
const IPFS_API_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS"

// Use this as the public gateway for accessing uploaded IPFS content
// Example: https://<GATEWAY>/ipfs/<CID>
const IPFS_GATEWAY_URL = "https://ivory-impossible-tarsier-23.mypinata.cloud/ipfs/"
