export enum DOMAIN {
  TESTNET = 'testnet',
  NEAR = 'near',
}

export const dotDomain = (domain: DOMAIN) =>
  `.${domain}`;

export const dotDomains = (domains: DOMAIN[]) =>
  domains.map(dotDomain);

export const accountUDomain = (accountId: string, domain: DOMAIN): string =>
  `${accountId}${dotDomain(domain)}`;
