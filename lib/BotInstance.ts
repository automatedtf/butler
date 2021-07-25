import IncomingTradeOffer from './offer/IncomingTradeOffer';
import OutgoingTradeOffer from './offer/OutgoingTradeOffer';
import { SteamLoginDetails, SteamSecrets } from './types';

const SteamUser = require("steam-user");
const TradeOfferManager = require("steam-tradeoffer-manager");
const SteamCommunity = require("steamcommunity");
const SteamTotp = require("steam-totp");

class BotInstance {
    // steam-user
    // steamcommunity
    // steam trade offer manager
    secrets: SteamSecrets;
    steam_user: any;

    cookies: string[];

    community: any;
    trade_manager: any;

    constructor(secrets: SteamSecrets, cookies: string[]) {
        this.secrets = secrets;
        this.cookies = cookies;
    }

    private async _loginToSteamUser() {
        return await new Promise((resolve, reject) => {
            let client = new SteamUser();
            if (!this.secrets.twoFactorCode) {
                this.secrets.twoFactorCode = SteamTotp.getAuthCode(this.secrets.sharedSecret);
            }

            client.logOn(this.secrets);

            client.on("loggedOn", () => {
                client.on("webSession", (_, cookies) => {
                    console.log(cookies);
                    this.cookies = cookies;
                    resolve(client);
                });
            });
        });
    }

    private async _loginToTradeManager() {
        let steam = (this.cookies) ? new SteamUser() : await this._accessSteamUser();

        return await new Promise((resolve, reject) => {
            let manager = new TradeOfferManager({ steam, "language": "en" });
            manager.setCookies(this.cookies, null, (err) => {
                if (err) reject("Account limited");
                resolve(manager);
            });
        });
    }

    private async _loginToCommunity() {
        if (this.cookies == null) await this._accessSteamUser();
        
        return await new Promise((resolve, reject) => {
            let community = new SteamCommunity();
            community.setCookies(this.cookies);
            resolve(community);
        });
    }

    private async _accessSteamUser() {
        this.steam_user = this.steam_user || await this._loginToSteamUser();
        return this.steam_user;
    }

    async accessTradeManager() {
        this.trade_manager = this.trade_manager || await this._loginToTradeManager();
        return this.trade_manager;
    }

    async getOffer(id: string): Promise<IncomingTradeOffer> {
        let tradeManager = await this.accessTradeManager();

        return await new Promise((resolve, reject) => {
            tradeManager.getOffer(id, async (err, offer) => {
                if (err) return reject(err);
                return resolve(new IncomingTradeOffer({
                    offer,
                    community: await this.accessCommunity(),
                    identitySecret: this.secrets.identitySecret
                }));
            });
        });
    }
    
    async createOffer(tradeURL: string): Promise<OutgoingTradeOffer> {
        let tradeManager = await this.accessTradeManager();
        const offer = tradeManager.createOffer(tradeURL);
        return new OutgoingTradeOffer({
            offer,
            community: await this.accessCommunity(),
            identitySecret: this.secrets.identitySecret
        });
    }

    async accessCommunity() {
        this.community = this.community || await this._loginToCommunity();
        console.log(this.community);
        return this.community;
    }
}

export function withCookies(cookies: string[]): BotInstance {
    return new BotInstance(null, cookies)
}

export function withLoginDetails(secrets: SteamSecrets): BotInstance {
    return new BotInstance(secrets, null);
}