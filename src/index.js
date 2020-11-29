import logger from "./log.js";
import conn from "./conn.js";

import { Contract, providers, utils } from "ethers";

import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

var app = {
    web3Provider: null,
    wallet: null,


    loginAcct: null,

    init: function () {
        $(".connMetaMask").on('click', function () {
            app.connWallet("metamask")
        });
        $(".connMobileWallet").on('click', function () {
            app.connWallet("mobile")
        });

        $.each($(".apis fieldset"), function (index, element) {
            var obj = $(element);
            var api = obj.data("api");
            obj.find("button").on('click', async function (event) {
                event.preventDefault();
                obj.find(".result").text("...");

                await app[api](obj).then(result => {
                    obj.find(".result").text(result);
                })
                    .catch(err => {
                        obj.find(".result").html(logger.html("call failed", err));
                    })
            })
        });
    },
    async connWallet(way) {
        try {
            var provider = conn.selectProvider(way);

            provider.enable()
                .then(accounts => {
                    // conn.monitor(provider);
                    //warp use etherjs
                    app.wallet = conn.getConnector(provider);
                    app.web3Provider = conn.getWeb3Provider(provider.isMetaMask ? provider.networkVersion : provider.chainId);
                    app.saveLoginInfo(accounts);
                    $(".apis").show();
                }).catch(error => {
                    logger.error("connect wallet failed", error);
                })

        } catch (error) {
            logger.error(error);
        }
    },
    async saveLoginInfo(accounts) {
        if (accounts.length == 0) {
            logger.error("not accounts")
            return;
        }
        var acct = accounts[0];
        var loginObj = $(".login");
        loginObj.find(".address").text(acct);

        var btn = $("<button>disConnect</button>");
        btn.on('click', async function () {
            if (app.wallet.isMetaMask) {
                //clear login info
                loginObj.hide();
                logger.info("login out");
            } else {
                await app.wallet.disconnect().then(r => {
                    logger.info("disconnect", r);
                    loginObj.hide();
                    logger.info("login out");
                })
            }
        });
        loginObj.find(".action").html(btn);
        loginObj.show();

        if (acct == app.loginAcct) {
            logger.info("login account has not changed");
        } else {
            logger.info("login account changed");
            if (app.wallet.isMetaMask) {
                logger.info("login with metamaks", acct);
            } else {
                logger.info("login with mobile wallet", {
                    acct: acct,
                    walletMeta: app.wallet.peerMeta,
                });
            }
            app.loginAcct = acct;
        }
    },

    // 网络连接信息
    async net_version() {
        return app.wallet.request({ method: "net_version" })
            .then(chainId => {
                // more: https://chainid.network/
                var networks = {
                    "1": "Ethereum Mainnet",
                    "2": "Morden Testnet",
                    "3": "Ropsten Testnet",
                    "4": "Rinkeby Testnet",
                    "42": "Kovan Testnet",
                }
                var txt = networks[chainId];
                return chainId + "-" + (typeof txt != "undefined" ? txt : "unknown")
            })
    },

    // 查询余额
    async eth_getBalance(target) {
        target.find(".result").text("...");

        var addr = target.find("input[name='address']").val();
        // 基于 etherjs
        return app.web3Provider.getBalance(addr)

    },

    async signMsg(target) {
        // const signer = provider.getSigner();
        // return signer.signMessage(target.find("input").val());
        // return app.web3Provider.eth.sign(target.find("input").val())
        var message = target.find("input").val();

        var messageHash = utils.keccak256(utils.toUtf8Bytes("\x19Ethereum Signed Message:\n" + message.length + message))    // Required
        if (app.wallet.isMetaMask) {
            return app.wallet.request(
                {
                    method: "personal_sign",
                    params: [messageHash, app.loginAcct]
                });
        } else {
            const msgParams = [
                app.loginAcct,                            // Required
                messageHash
            ];

            // Sign message
            return app.wallet.signMessage(msgParams)
        }
    }


}

app.init();



