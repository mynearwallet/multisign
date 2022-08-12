import getNetworkConfig from "../../lib/network";


type Options = {
  // that's ok for unknown payload
  // eslint-disable-next-line
  body?: Record<string, any>;
  responseType?: 'blob'|'json';
}

const request = async (host: string, options?: Options) => {
  const response = await fetch(host, options ? {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options?.body || {})
  } : undefined);

  return response[options?.responseType || 'json']();
};

const buildHost = (host: string, arm: string) => `${host}${arm}`;

const getConfidantHost = (arm: string) => buildHost('http://localhost:7895', arm);
const getHelperHost = (arm: string) => buildHost(getNetworkConfig().helperUrl || '', arm);
// const getIndexerHost = (arm: string) => buildHost(INDEXER_SERVICE_URL || '', arm);
// const getFinanceHost = (arm: string) => buildHost(FINANCE_API || '', arm);


export const confidantRequest = async (arm: string, options?: Options) =>
  request(getConfidantHost(arm), options);

export const helperRequest = async (arm: string, options?: Options) =>
  request(getHelperHost(arm), options);
