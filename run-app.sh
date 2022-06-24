#!/bin/bash

cd client && npm start &
cd server && npx nodemon server.js