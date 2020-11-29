import logger from "./log.js";

import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers } from "ethers";

const infuraId = "e758353f25c643579161588081317f0a";

var conn = {
    curr: {},

    selectProvider(wallet) {
        if (wallet == "metamask") {
            if (typeof window.ethereum == 'undefined') {
                throw "uninstall meta mask";
            } else if (window.ethereum.isMetaMask) {
                return window.ethereum;
            } else {
                throw "uninstall meta mask";
            }
        } else if (wallet == "mobile") {
            return new WalletConnectProvider({
                infuraId: "e758353f25c643579161588081317f0a", // Required
                bridge: "https://bridge.walletconnect.org",
                qrcode: true,
            });
        }
    },
    getWeb3Provider(chainId) {
        if (typeof chainId == "string") {
            chainId = parseInt(chainId, 10);
        }
        // Infura 是一个Ethereum blokchain Node
        return new providers.InfuraProvider(chainId, infuraId);
    },
    getConnector(provider) {
        var connector;
        if (provider.isMetaMask) {
            connector = provider;
        } else {
            connector = new WalletConnect({
                bridge: provider.bridge, // Required
                qrcodeModal: QRCodeModal,
            });
        }
        return this.monitor(connector);;
    },



    monitor(connector) {
        // metamask
        connector.on("accountsChanged", accounts => {
            logger.info("accountsChanged", accounts);
        })
        connector.on("chainChanged", chainId => {
            logger.info("chainChanged", chainId);
        })

        // Subscribe to connection events
        connector.on("connect", (error, payload) => {
            if (error) {
                logger.error("wallet connect failed", error);
            } else {
                logger.info("connect", payload);
            }
        });

        connector.on("session_update", (error, payload) => {
            if (error) {
                logger.error("mobile wallet connect session update", error);
            } else {
                logger.info("session_update", payload);
                // Get updated accounts and chainId
                // const { accounts, chainId } = payload.params[0];
            }
        });

        connector.on("disconnect", (error, payload) => {
            if (error) {
                logger.error("mobile wallet disconnect with error", error);
            } else {
                logger.error("mobile wallet disconnect!!")
            }

            // Delete connector
        });
        return connector;
    }
    // async enable(provider) {
    //     return provider.enable();



    //     //  Create WalletConnect Provider
    //     const provider = new WalletConnectProvider({
    //         infuraId: "e758353f25c643579161588081317f0a", // Required
    //         bridge: "https://bridge.walletconnect.org",
    //         qrcode: true,
    //         qrcodeModalOptions: {
    //             mobileLinks: [
    //                 "rainbow",
    //                 "metamask",
    //                 "argent",
    //                 "trust",
    //                 "imtoken",
    //                 "pillar",
    //                 // "imToken",
    //             ]
    //         }
    //     });

    //     // await provider.close();

    //     //  Enable session (triggers QR Code modal)
    //     // await provider.enable();
    //     logger.info("connnet")
    //     //  Wrap with Web3Provider from ethers.js
    //     // const provider = new providers.Web3Provider(web3Provider);
    //     // // window.WalletConnect = require(loadFile("https://cdn.jsdelivr.net/npm/@walletconnect/client@1.3.1/dist/cjs/index.min.js"));
    //     // // Create a connector
    //     // const connector = new WalletConnect({
    //     //     bridge: "https://bridge.walletconnect.org", // Required
    //     //     qrcodeModal: QRCodeModal,
    //     // });

    //     // Check if connection is already established
    //     if (!provider.connected) {
    //         // create new session
    //         provider.createSession();
    //     } else {
    //         logger.info("connected mobile wallet");
    //     }

    //     // Subscribe to connection events
    //     provider.on("connect", (error, payload) => {
    //         if (error) {
    //             logger.error(error);
    //         } else {
    //             // Get provided accounts and chainId
    //             const { accounts, chainId } = payload.params[0];
    //             conn.curr.currWallet = provider;
    //             conn.curr.accounts = accounts;
    //             conn.curr.chainId = chainId;
    //         }
    //     });

    //     provider.on("session_update", (error, payload) => {
    //         if (error) {
    //             logger.error(error);
    //         } else {

    //             // Get updated accounts and chainId
    //             const { accounts, chainId } = payload.params[0];
    //         }
    //     });

    //     provider.on("disconnect", (error, payload) => {
    //         if (error) {
    //             logger.error(error);
    //         } else {
    //             logger.error("mobile wallet disconnect!!")
    //         }

    //         // Delete connector
    //     });
    //     return provider;
    // }

}

export default conn;