import dotenv from 'dotenv';

dotenv.config();

const config = {
  dev: {
    url: process.env.DATABASE_URL
  },
  test: {
    url: process.env.TEST_DATABASE_URL
  },
  production: {
    url: process.env.PRODUCTION_URL
  }
}

export default config;