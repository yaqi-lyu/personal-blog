"use client";
import React, { useState, useContext } from "react";
import { GlobalQuery } from "../../tina/__generated__/types";

interface LayoutState {
  globalSettings?: GlobalQuery["global"];
  setGlobalSettings: React.Dispatch<
    React.SetStateAction<GlobalQuery["global"] | undefined>
  >;
  pageData?: {};
  setPageData: React.Dispatch<React.SetStateAction<{} | undefined>>;
  theme?: GlobalQuery["global"]["theme"];
}

const defaultLayoutState: LayoutState = {
  theme: {
    __typename: "GlobalTheme",
    color: "blue",
    darkMode: "default",
  },
  globalSettings: undefined,
  pageData: undefined,
  setGlobalSettings: () => {},
  setPageData: () => {},
};

const LayoutContext = React.createContext<LayoutState>(defaultLayoutState);

export const useLayout = () => {
  return useContext(LayoutContext);
};

interface LayoutProviderProps {
  children: React.ReactNode;
  globalSettings?: GlobalQuery["global"];
  pageData?: {};
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({
  children,
  globalSettings: initialGlobalSettings,
  pageData: initialPageData,
}) => {
  const [globalSettings, setGlobalSettings] = useState<GlobalQuery["global"] | undefined>(
    initialGlobalSettings
  );
  const [pageData, setPageData] = useState<{} | undefined>(initialPageData);

  const theme = globalSettings?.theme;

  return (
    <LayoutContext.Provider
      value={{
        globalSettings,
        setGlobalSettings,
        pageData,
        setPageData,
        theme,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
