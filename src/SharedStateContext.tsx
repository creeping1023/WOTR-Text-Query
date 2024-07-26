import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';

type dataType = {
  search:string
};

// 定义共享状态的类型
interface SharedStateContextType {
  sharedState: dataType;
  setSharedState: React.Dispatch<React.SetStateAction<dataType>>;
}

// 创建上下文，并提供默认值
const SharedStateContext = createContext<SharedStateContextType | undefined>(undefined);

interface SharedStateProviderProps {
  children: ReactNode;
}

// 创建提供者组件
export const SharedStateProvider: React.FC<SharedStateProviderProps> = ({ children }) => {
  const [searchParams] = useSearchParams();
  const [sharedState, setSharedState] = useState<dataType>({
    search: searchParams.get('search') ?? ''
  });

  return (
    <SharedStateContext.Provider value={{ sharedState, setSharedState }}>
      {children}
    </SharedStateContext.Provider>
  );
};

// 创建一个自定义钩子来使用上下文
export const useSharedState = (): SharedStateContextType => {
  const context = useContext(SharedStateContext);
  if (context === undefined) {
    throw new Error('useSharedState must be used within a SharedStateProvider');
  }
  return context;
};
