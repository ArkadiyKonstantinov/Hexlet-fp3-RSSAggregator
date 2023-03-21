import { resolve } from 'path';

export default {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: resolve(process.cwd(), 'dist'),
    },
    watchFiles: [resolve(process.cwd(), 'dist/index.html')],
    open: true,
    hot: true,
    liveReload: true,
    compress: true,
    historyApiFallback: true,
  },
};
