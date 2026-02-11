export interface Store {
  storeId: string;
  socketId: string;
  tpiInfo?: Info;
  status?: StatusMessage;
  clientVersion?: string;
}

export interface StatusMessage {
  message: string;
  type: "info" | "error";
  timestamp: Date | number;
}

export interface InfoAppVersions {
  appVersion: string;
  PosServerVersion: string;
  zodiac: string;
  roamer_Client: string;
  gmVersion: string;
}

export interface Info extends InfoAppVersions {
  secureServer: boolean;
  logLevel: number;
  servicePort: number;
  storeId: string;
  price: number;
  appName: string;
  businessDateStart: string;
  intelligentHPDiscount: boolean;
  PosServerAlive: boolean;
  dbServer: string;
  dbName: string;
  serverTimeStamp: string;
  serverCurrentTime: number;
}
