import IncomingTradeOffer from './offer/IncomingTradeOffer';
import OutgoingTradeOffer from './offer/OutgoingTradeOffer';
import { SteamLoginDetails } from './types';

const SteamUser = require("steam-user");
const TradeOfferManager = require("steam-tradeoffer-manager");
const SteamCommunity = require("steamcommunity");

class BotInstance {
    // steam-user
    // steamcommunity
    // steam trade offer manager
    details: SteamLoginDetails;
    steam_user: any;

    cookies: string[];

    community: any;
    trade_manager: any;

    constructor(details: SteamLoginDetails, cookies: string[]) {
        this.details = details;
        this.cookies = cookies;
    }

    private async _loginToSteamUser() {
        return await new Promise((resolve, reject) => {
            let client = new SteamUser();
            client.logOn(this.details);

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
            tradeManager.getOffer(id, (err, offer) => {
                if (err) return reject(err);
                return resolve(new IncomingTradeOffer(offer));
            });
        });
    }
    
    async createOffer(tradeURL: string): Promise<OutgoingTradeOffer> {
        let tradeManager = await this.accessTradeManager();
        return tradeManager.createOffer(tradeURL);
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

export function withLoginDetails(details: SteamLoginDetails): BotInstance {
    return new BotInstance(details, null);
}