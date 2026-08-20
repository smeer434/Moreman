# Moreman

AI dataset marketplace with pay-per-read access. Built on Shelby 
Protocol.

## Overview

Buying a full dataset upfront is a bad deal when you only need to query 
it a handful of times. Moreman flips the model: dataset owners set a 
price per read, and buyers pay only for the queries they actually make — 
in real APT, sent instantly, straight to the owner's wallet.

## Core Functionality

### Listing a Dataset

Dataset owner uploads the dataset through Shelby, sets a description and 
a price per read, and signs a registration transaction. Nothing appears 
in the marketplace until that transaction confirms on-chain.

### Reading a Dataset

A buyer selects a dataset and pays the listed per-read price through a 
signed transaction. The payment goes directly to the owner's wallet 
address — no escrow, no intermediary balance. Access is only granted 
once that payment confirms; a cancelled or rejected transaction returns 
nothing.

### Tracking Reads

Every confirmed paid read increments a real, on-chain-backed counter 
visible on the dataset's card — not a number the frontend just makes up.

### Managing Your Data

My Data shows two things for the connected wallet: datasets you've 
listed (with earnings from reads), and datasets you've personally paid to 
read. Delisting a dataset you own requires a signed transaction, same as 
everything else.

## Architecture

| Component | Role |
|---|---|
| Aptos wallet adapter / Petra | Wallet connection, transaction signing |
| Shelby Protocol | Dataset storage, high-frequency read access |
| Aptos testnet (Shelbynet) | Records every listing, read payment, and 
delisting on-chain |

## Repository

- Live: 
- Source: 

## Maintainer

Smeer — [GitHub](https://github.com/smeer434)

## Disclaimer

This is an independent, unofficial project built using Shelby Protocol. 
It is not developed, endorsed, or maintained by the Shelby team.
