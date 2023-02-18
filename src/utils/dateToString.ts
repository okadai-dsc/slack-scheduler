export const dateToString = (timestamp: number, duration: number): string => {
  const endTimestamp = timestamp + duration * 60;

  return `<!date^${timestamp}^{date} {time}|${timestamp}>-<!date^${endTimestamp}^{time}|${endTimestamp}>`;
};
