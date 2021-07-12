import { SteamLoginErrors } from './enums/Login';

export interface Item {
    assetid: string;
    appid: number;
    contextid: string;
    amount: number;
}

export interface SteamLoginDetails {
    accountName: string;
    password: string;
    steamguard?: string; // Steam Guard code for those logging in on Steam Guard Authorisation email
    authCode?: string; // Steam Guard code on first email authentication
    twoFactorCode?: string;
    captcha?: string;
    disableMobile?: boolean;
    logonID?: number;
}

export interface SteamLoginResponse {
    error?: SteamLoginErrors,
    emaildomain?: string;
    captchaurl?: string;
}