import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.3bacb78a65d747eaa3b3e0fde0fc17d9',
  appName: 'orbit-life-compass',
  webDir: 'dist',
  server: {
    url: 'https://3bacb78a-65d7-47ea-a3b3-e0fde0fc17d9.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav"
    },
    StatusBar: {
      // Match app dark background so the status bar blends in instead of clipping content.
      style: "DARK",
      backgroundColor: "#0d1117",
      // Keep the WebView below the status bar (not under it).
      overlaysWebView: false
    }
  }
};

export default config;
