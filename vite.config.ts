import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // client
      "@hooks": path.resolve(__dirname, "src/client/hooks"),
      "@components": path.resolve(__dirname, "src/client/components"),
      "@stores": path.resolve(__dirname, "src/client/stores"),
      "@apis": path.resolve(__dirname, "src/client/apis"),
      "@cliroutes": path.resolve(__dirname, "src/client/routes"),
      // server
      "@middlewares": path.resolve(__dirname, "src/server/middlewares"),
      "@controllers": path.resolve(__dirname, "src/server/controllers"),
      "@services": path.resolve(__dirname, "src/server/services"),
      "@db": path.resolve(__dirname, "src/server/db"),
      "@srvroutes": path.resolve(__dirname, "src/server/routes"),
      // shared
      "@utils": path.resolve(__dirname, "src/utils"),
      "@shared": path.resolve(__dirname, "src/shared"),
    },
  },
});
