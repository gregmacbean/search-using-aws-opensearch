/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import csv from 'csvtojson';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config({ path: '../http/.env' });

const handler = async () => {
  const results = await csv().fromFile('./data.csv');

  for (const row of results) {
    const response = await fetch(
      `https://${process.env.ENDPOINT}/jobs/_doc/${row.Ad_ID}`,
      {
        method: 'put',
        body: JSON.stringify(row),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(
            `${process.env.USERNAME}:${process.env.PASSWORD}`,
          )}`,
        },
      },
    );

    console.log('response', await response.json());
  }
};

(async () => {
  await handler();
})();
