export class APIError extends Error {
  constructor(public status: number, public statusText: string) {
    super(`${status}: ${statusText}`);
  }
}

export function getAverageScore(scoreCategories: {
  catchyness: number;
  vocals: number;
  sound: number;
  immersion: number;
  performance: number;
}) {
  return (
    (scoreCategories.catchyness +
      scoreCategories.vocals +
      scoreCategories.sound +
      scoreCategories.immersion +
      scoreCategories.performance) /
    5
  );
}

export function getSlug(name = "") {
  return name.replace(/[^a-z\d]/gi, "-").toLowerCase();
}

export function getLanguage(req: Request) {
  const headerValue = req.headers.get("accept-language");

  return (headerValue ?? "").split(",")[0];
}

export function getTimeAgo(timestamp: number, options?: { language: string }) {
  const rtf = new Intl.RelativeTimeFormat(options?.language ?? "en", {
    numeric: "auto",
  });

  const secondsDifference = Math.round((timestamp - Date.now()) / 1000);

  if (secondsDifference > -60) {
    return "just now";
  }

  const minutesDifference = Math.ceil(secondsDifference / 60);
  if (minutesDifference > -60) {
    return rtf.format(minutesDifference, "minutes");
  }

  const hoursDifference = Math.ceil(minutesDifference / 60);
  if (hoursDifference > -60) {
    return rtf.format(hoursDifference, "hours");
  }

  const daysDifference = Math.ceil(hoursDifference / 24);
  if (daysDifference > -7) {
    return rtf.format(daysDifference, "days");
  }

  const weeksDifference = Math.ceil(daysDifference / 7);
  if (daysDifference > -31) {
    return rtf.format(weeksDifference, "weeks");
  }

  const monthsDifference = Math.ceil(daysDifference / 30);
  if (daysDifference > -365) {
    return rtf.format(monthsDifference, "months");
  }

  const yearsDifference = Math.ceil(daysDifference / 365);
  return rtf.format(yearsDifference, "years");
}
