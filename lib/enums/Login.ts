export enum SteamLoginErrors {
    MissingDetails = "MissingDetails",
    IncorrectDetails = "Error: Uncaught Error: The account name or password that you have entered is incorrect.",
    SteamGuard = "SteamGuard",
    SteamGuardMobile = "SteamGuardMobile",
    Captcha = "CAPTCHA",
    OldSession = "Old Session"
}

export enum Steam2FAErrors {
    NoMobile = "Error 2"
}