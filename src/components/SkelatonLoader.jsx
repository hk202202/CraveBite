import { Box, Skeleton } from "@mui/material";
import { motion } from "framer-motion";

export const SkeletonLoader = () => {
  return (
    <motion.div
      className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 transform hover:scale-105"
      key="skeleton"
    >
      <Skeleton variant="rectangular" height={200} />
      <Box p={6}>
        <Skeleton variant="text" height={20} width={200} />
        <Skeleton variant="text" height={20} width={100} />
        <Skeleton variant="text" height={16} width={150} />
        <div className="flex items-baseline mt-4 mb-6 pb-6 border-b border-gray-200">
          <div className="flex text-sm gap-2">
            <Skeleton variant="text" height={20} width={60} />
            <Skeleton variant="text" height={20} width={60} />
            <Skeleton variant="text" height={20} width={60} />
          </div>
        </div>
        <div className="flex space-x-4 mb-6 text-sm font-medium">
          <div className="flex-auto flex space-x-4">
            <Skeleton variant="text" height={40} width={100} />
          </div>
          <Skeleton variant="circular" height={36} width={36} />
        </div>
        <Skeleton variant="text" height={16} width={250} />
      </Box>
    </motion.div>
  );
};
