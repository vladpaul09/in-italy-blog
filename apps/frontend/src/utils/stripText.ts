export default function stripText(description: string, limit: boolean = true, threshold: number = 100) {
  const regex = /<[^>]*>?/gm;

  if (!description) {
    return "";
  }

  if (limit) {
    const out = description.replace(regex, "").slice(0, threshold);
    return out.length >= threshold ? out + "..." : out;
  } else {
    return description.replace(regex, "");
  }
}

export function stripTextWithWord(text: string, threshold: number = 100) {
  const regex = /<[^>]*>?/gm;

  const out = text.replace(regex, "");
  const words = out.split(" ");
  let totalLength = 0;

  const limitedWords = words.reduce((acc: string[], word: string, index: number) => {
    const initialLength = totalLength;
    totalLength += index === words.length ? word.length : word.length + 1; 
    if (initialLength < threshold) {
      acc.push(word);
    }
    return acc;
  }, []);

  return limitedWords.join(" ") + (totalLength > threshold ? "..." : "");
}

export function htmlEscape(str: string) {
  return str.replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
}



