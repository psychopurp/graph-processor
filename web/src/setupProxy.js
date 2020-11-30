const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "http://localhost:8899/api",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/",
      },
      secure: true, //如果访问的是https类的链接，就需要设置为true
    })
  );
};
