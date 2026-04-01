import { http, createConfig } from 'wagmi';
import { hardhat, polygonAmoy } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [hardhat, polygonAmoy],
  connectors: [
    injected(),
  ],
  ssr: true,
  transports: {
    [hardhat.id]: http('http://127.0.0.1:8545'),
    [polygonAmoy.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
  },
});
