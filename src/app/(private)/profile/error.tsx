"use client";
export default function Error({ error }: { error: Error }) {
  return (
    <div>
      <h2>Error while trying to load the profile. Please try again later</h2>
    </div>
  );
}
