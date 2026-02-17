import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';

export const useWarmUpBrowser = () => {
    useEffect(() => {
        void WebBrowser.warmUpAsync().catch((e) => {
            // console.error('WarmUpBrowser error:', e);
        });

        return () => {
            void WebBrowser.coolDownAsync().catch((e) => {
                // console.error('CoolDownBrowser error:', e);
            });
        };
    }, []);
};
