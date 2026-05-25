export default function validationArrayToObject(arrays: Array<Array<string | number>>, messages: Array<string | number>): Record<string, any> {
  const result: Record<string, any> = {};

  arrays.forEach((path, index) => {
    let current = result; // Start at the root object

    // Traverse the path except the last element
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];

      // If the key is a number, initialize as an array; otherwise, as an object
      // current[key] = typeof path[i + 1] === "number" ? current[key] || [] : current[key] || {};

      current[key] = current[key] || {};
      // Move one level deeper
      current = current[key];
    }

    // Set the final value (null as a placeholder)
    const lastKey = path[path.length - 1];
    current[lastKey] = [messages[index]];
  });

  return result;
}
