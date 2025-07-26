import { createContext, useContext, useRef } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

const AgoraContext = createContext(null);

export const AgoraProvider = ({ children }) => {
  const client = useRef(
    AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
  );

  return (
    <AgoraContext.Provider value={client.current}>
      {children}
    </AgoraContext.Provider>
  );
};

export const useAgoraClient = () => useContext(AgoraContext);