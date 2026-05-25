const delayClientRequest = (t: number) => new Promise((resolve) => setTimeout(resolve, t));

export default delayClientRequest;
