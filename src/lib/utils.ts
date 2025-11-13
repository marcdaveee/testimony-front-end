import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractErrors(
  errors: string[],
  fieldName: string,
  stripFirstWord?: boolean
) {
  const relatedFieldErrors = errors.filter(item =>
    item.split(" ")[0].toLowerCase().includes(fieldName)
  );

  if (relatedFieldErrors.length > 0) {
    // if there's a related field error
    let formattedErrMessages: string[] = [];

    relatedFieldErrors.forEach(relatedErr => {
      if (relatedErr.split(" ")[0].toLowerCase().includes(fieldName)) {
        let msg = "";
        relatedErr.split(" ").forEach((str, index) => {
          if (stripFirstWord) {
            if (index != 0) {
              msg = msg + str + " ";
            }
          } else {
            msg = msg + str + " ";
          }
        });
        msg = msg.trimEnd();
        msg = msg[0].toUpperCase() + msg.slice(1);

        formattedErrMessages.push(msg);
      }
    });

    return formattedErrMessages;
  } else {
    return undefined;
  }
}
