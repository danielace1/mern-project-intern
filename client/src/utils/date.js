import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const formatPostDate = (createdAt) => {
  const createdAtDate = dayjs(createdAt);
  const currentDate = dayjs();

  const timeDifferenceInSeconds = currentDate.diff(createdAtDate, "second");
  const timeDifferenceInMinutes = currentDate.diff(createdAtDate, "minute");
  const timeDifferenceInHours = currentDate.diff(createdAtDate, "hour");
  const timeDifferenceInDays = currentDate.diff(createdAtDate, "day");

  if (timeDifferenceInDays > 1) {
    return createdAtDate.format("MMM D");
  } else if (timeDifferenceInDays === 1) {
    return "1d";
  } else if (timeDifferenceInHours >= 1) {
    return `${timeDifferenceInHours}h`;
  } else if (timeDifferenceInMinutes >= 1) {
    return `${timeDifferenceInMinutes}m`;
  } else {
    return "Just now";
  }
};

export const formatMemberSinceDate = (createdAt) => {
  const date = dayjs(createdAt);
  return `Joined ${date.format("MMMM YYYY")}`;
};
