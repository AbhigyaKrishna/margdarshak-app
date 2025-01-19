import { useState } from 'react';

interface UseRefreshProps {
  onRefresh: () => Promise<void>;
}

export const useRefresh = ({ onRefresh }: UseRefreshProps) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  return {
    refreshing,
    handleRefresh,
  };
};