import 'reflect-metadata';
import myDataSource from './data-source';
import app from './app';

(async () => {
  try {
    await myDataSource.initialize();
    console.log('Data Source has been initialized!');

    const port = 3000;
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error during initialization:', error);
    process.exit(1);
  }
})();
