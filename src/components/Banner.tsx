import type { BannerProps } from "@models/type";

export const Banner = ({ isVisible }: BannerProps) => {
  if (!isVisible) return null;

  return (
    <div className="relative mt-4 mb-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 md:p-6 rounded-lg shadow-lg">
        <div className="text-2xl md:text-3xl font-bold">
          You've made updates to the table!
        </div>
        <div className="mt-2 text-lg md:text-xl">
          Please submit your changes to save them.
        </div>
      </div>
    </div>
  );
};
