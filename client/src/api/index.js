import axios from "axios";

const { REACT_APP_API_URL } = process.env;
if (!REACT_APP_API_URL)
  throw new Error("REACT_APP_API_URL environment variable is required");

export const getChainData = async ({ blockRange, startDate, endDate, miner }) => {
  const { data } = await axios.get(`${REACT_APP_API_URL}/api/chain`, {
    params: {
      startBlock: blockRange[0],
      endBlock: blockRange[1],
      startDate,
      endDate,
      miner
    }
  });

  return data
}

export const getBlockRange = async () => {
  const { data } = await axios.get(`${REACT_APP_API_URL}/api/blocks/range`);

  return data
}
