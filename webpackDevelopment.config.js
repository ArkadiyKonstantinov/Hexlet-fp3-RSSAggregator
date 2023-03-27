import { resolve } from 'path';

export default {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: resolve(process.cwd(), 'dist'),
    },
    watchFiles: ['src/*.js', 'src/*.html'],
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  watchOptions: {
    aggregateTimeout: 300, // Delay the first rebuild (in ms)
    poll: 1000, // Poll using interval (in ms or a boolean)
    ignored: /node_modules/, // Ignore to decrease CPU usage
  },
};
