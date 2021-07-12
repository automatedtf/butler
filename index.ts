require("dotenv").config();
import SteamTotp from "steam-totp";
import { withLoginDetails, withCookies } from './lib/BotInstance';

(async () => {
    await withLoginDetails({
        accountName: process.env.ACCOUNT_NAME,
        password: process.env.ACCOUNT_PASSWORD,
        twoFactorCode: SteamTotp.getAuthCode(process.env.SHARED_SECRET),
        logonID: parseInt(process.env.LOGON_ID)
    }).accessCommunity();
})();
