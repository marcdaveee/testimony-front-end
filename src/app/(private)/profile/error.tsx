"use client";

import { useEffect } from "react";

export default function Error({ error }: { error: Error }) {
  useEffect(() => {
    if (error) {
      console.log(`Error: ${error}`);
    }
  }, [error]);

  return (
    <div>
      <h2>Error while trying to load the profile. Please try again later</h2>
    </div>
  );
}
