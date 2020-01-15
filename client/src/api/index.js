import axios from "axios";

const { REACT_APP_API_URL } = process.env;
if (!REACT_APP_API_URL)
  throw new Error("REACT_APP_API_URL environment variable is required");

export const getChainData = async (bhRangeStart, bhRangeEnd) => {
  const chainAPI =
    bhRangeStart && bhRangeEnd
      ? `${REACT_APP_API_URL}/api/chain?start=${bhRangeStart}&end=${bhRangeEnd}`
      : `${REACT_APP_API_URL}/api/chain`;
  const res = await axios.get(chainAPI);
  return res
}
